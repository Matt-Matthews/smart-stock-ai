import OpenAI from 'openai';
import cron from 'node-cron';
import { prisma } from '@configs/mysql-db.config.js';

interface ITransactionSnapshot {
  id: string;
  type: string;
  quantity: number;
  created_at: Date;
}

interface IInventoryAlert {
  itemId: string;
  itemName: string;
  companyId: string;
  currentQuantity: number;
  averageDailyUsage: number;
  forecastDaysLeft: number;
  recommendedOrderQty: number;
  reason: string;
}

const normalizeTransactionType = (value: string) => value.toLowerCase().trim();

const getOutboundQuantity = (type: string, quantity: number) => {
  const normalized = normalizeTransactionType(type);

  const inboundTypes = ['in', 'stock_in', 'restock', 'purchase', 'receive', 'return', 'inventory_in', 'adjustment_in'];
  const outboundTypes = ['out', 'stock_out', 'sale', 'usage', 'consume', 'dispatch', 'adjustment_out', 'inventory_out'];

  if (inboundTypes.includes(normalized)) {
    return 0;
  }

  if (outboundTypes.includes(normalized) || normalized.includes('out') || normalized.includes('sale') || normalized.includes('usage')) {
    return Math.max(0, Math.abs(quantity));
  }

  return Math.abs(quantity) > 0 && quantity < 0 ? Math.abs(quantity) : 0;
};

const getForecastFromAi = async (itemName: string, currentQuantity: number, averageDailyUsage: number, recentTransactions: ITransactionSnapshot[]) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      forecastDaysLeft: averageDailyUsage > 0 ? Math.max(0, currentQuantity / averageDailyUsage) : 999,
      recommendedOrderQty: Math.max(10, Math.ceil((averageDailyUsage || 1) * 7)),
      reason: 'No AI key configured. Using heuristic stock projection.',
    };
  }

  const payload = {
    model: process.env.OPENAI_OCR_MODEL || 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              itemName,
              currentQuantity,
              averageDailyUsage,
              recentTransactions: recentTransactions.slice(-10).map((tx) => ({
                type: tx.type,
                quantity: tx.quantity,
                createdAt: tx.created_at.toISOString(),
              })),
              instruction: 'Return JSON only with forecastDaysLeft, recommendedOrderQty, and reason. forecastDaysLeft is how many days the current stock will likely last. recommendedOrderQty is the number of units to reorder now. reason should explain the recommendation briefly.',
            }),
          },
        ],
      },
    ],
  } as any;

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create(payload);
    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      forecastDaysLeft: Number(parsed.forecastDaysLeft ?? (averageDailyUsage > 0 ? currentQuantity / averageDailyUsage : 999)),
      recommendedOrderQty: Number(parsed.recommendedOrderQty ?? Math.max(10, Math.ceil((averageDailyUsage || 1) * 7))),
      reason: String(parsed.reason ?? 'AI forecast suggests replenishment.'),
    };
  } catch (error) {
    return {
      forecastDaysLeft: averageDailyUsage > 0 ? Math.max(0, currentQuantity / averageDailyUsage) : 999,
      recommendedOrderQty: Math.max(10, Math.ceil((averageDailyUsage || 1) * 7)),
      reason: 'AI forecast failed. Using heuristic fallback projection.',
    };
  }
};

const createReorderNotification = async (companyId: string, itemName: string, alert: IInventoryAlert) => {
  const user = await prisma.user.findFirst({
    where: {
      company_id: companyId,
      deleted_at: null,
      enabled: true,
    },
    orderBy: {
      created_at: 'asc',
    },
  });

  await prisma.notification.create({
    data: {
      user_id: user?.id || 'system',
      company_id: companyId,
      title: `Reorder required: ${itemName}`,
      message: `${itemName} is low on stock. Current quantity: ${alert.currentQuantity}. Avg daily usage: ${alert.averageDailyUsage.toFixed(2)}. Forecast: ${alert.forecastDaysLeft.toFixed(1)} days left. Recommended order: ${alert.recommendedOrderQty} units. ${alert.reason}`,
      type: 'warning',
    },
  });
};

export const monitorInventoryForReorders = async () => {
  const inventories = await prisma.inventory.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      item: true,
      transactions: {
        where: {
          deleted_at: null,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 30,
      },
    },
  });

  const alerts: IInventoryAlert[] = [];

  for (const inventory of inventories) {
    const recentTransactions: ITransactionSnapshot[] = inventory.transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      quantity: tx.quantity,
      created_at: tx.created_at,
    }));

    const totalOutbound = recentTransactions.reduce((sum, tx) => sum + getOutboundQuantity(tx.type, tx.quantity), 0);
    const windowDays = Math.max(1, recentTransactions.length || 1);
    const averageDailyUsage = totalOutbound / windowDays;
    const currentQuantity = Number(inventory.quantity ?? 0);
    const reorderPoint = Math.max(10, Math.ceil((averageDailyUsage || 1) * 7));
    const forecast = await getForecastFromAi(inventory.item.name, currentQuantity, averageDailyUsage, recentTransactions);

    const shouldAlert = currentQuantity <= reorderPoint || forecast.forecastDaysLeft <= 7;

    if (shouldAlert) {
      alerts.push({
        itemId: inventory.item_id,
        itemName: inventory.item.name,
        companyId: inventory.company_id,
        currentQuantity,
        averageDailyUsage,
        forecastDaysLeft: forecast.forecastDaysLeft,
        recommendedOrderQty: Math.max(forecast.recommendedOrderQty, reorderPoint),
        reason: forecast.reason,
      });
    }
  }

  for (const alert of alerts) {
    await createReorderNotification(alert.companyId, alert.itemName, alert);
  }

  return alerts;
};

export const startInventoryMonitoring = () => {
  const cronExpression = process.env.INVENTORY_MONITOR_CRON || '0 */6 * * *';

  const task = async () => {
    try {
      const alerts = await monitorInventoryForReorders();
      console.log(`[inventory-monitor] checked stock levels. Alerts generated: ${alerts.length}`);
    } catch (error) {
      console.error('[inventory-monitor] failed to process inventory alerts:', error);
    }
  };

  const existingJob = (globalThis as any).inventoryMonitorJob;
  if (existingJob) {
    return existingJob;
  }

  const scheduler = cron.schedule(cronExpression, task);
  (globalThis as any).inventoryMonitorJob = scheduler;
  console.log(`[inventory-monitor] scheduled with cron expression: ${cronExpression}`);
  return scheduler;
};

export default monitorInventoryForReorders;
