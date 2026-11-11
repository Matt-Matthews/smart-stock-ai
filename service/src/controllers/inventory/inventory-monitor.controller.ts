import type { Request, Response } from 'express';
import { monitorInventoryForReorders } from '@services/inventory/inventory-monitor.service.js';

const triggerInventoryMonitor = async (_req: Request, res: Response) => {
  const companyId = res.locals.authenticatedUser?.company_id;
  const userId = res.locals.authenticatedUser?.id;
  if (!companyId) {
    return res.status(401).json({
      status: 'error',
      message: 'Authenticated company is required.',
    });
  }

  try {
    const result = await monitorInventoryForReorders(companyId, userId);
    return res.status(200).json({
      status: 'success',
      data: {
        alerts: result.alerts,
        count: result.alerts.length,
        reports: result.reports,
      },
    });
  } catch (error) {
    console.error('[inventory-monitor] manual trigger failed:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to run inventory monitoring.',
    });
  }
};

export default triggerInventoryMonitor;
