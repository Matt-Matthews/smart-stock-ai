<template>
    <div class="flex flex-col flex-1 h-full">
        <div class="flex w-full gap-3">
            <DashTrendCard trend="neutral" comment="Current inventory value" :value="summary.total_stock_value" label="Total Stock Value"
                :trendValue="0" valueType="currency" />
            <DashTrendCard trend="neutral" comment="Requires attention" :value="summary.low_stock_items" label="Low Stock Items" :trendValue="0"
                valueType="count" icon="i-lucide-alert-triangle" />
            <DashTrendCard trend="neutral" comment="Since midnight" :value="summary.transactions_today" label="Transactions Today" :trendValue="0"
                valueType="count" icon="i-lucide-receipt-text" />
            <DashTrendCard trend="neutral" comment="Highest stock value" :value="summary.top_category || 'N/A'" label="Top Category"
                :trendValue="0" valueType="text" icon="i-lucide-circle-pile" />
        </div>
        <NuxtCard variant="soft" class="w-full p-2 mt-3">
            <p>Recent Transactions</p>
            <NuxtTable :data="summary.recent_transactions" :columns="transactionColumns" />
        </NuxtCard>
        <div class="flex gap-3 mt-3 w-full">
            <NuxtCard variant="soft" class="w-1/2 p-2">
                <p>Stock Value by Category</p>
                <p class="text-3xl font-bold mt-4">{{ summary.top_category || 'No category data' }}</p>
                <p class="text-sm text-muted">{{ formatMoney(summary.top_category_value) }}</p>
            </NuxtCard>
            <NuxtCard variant="soft" class="w-1/2 p-2">
                <p>Inventory Status</p>
                <p class="text-sm text-muted mt-4">{{ summary.low_stock_items }} items need replenishment.</p>
            </NuxtCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDashboardRequests } from '~/composables/useDashboardRequests'
const { user } = storeToRefs(useUserStore())
const token = useAuthToken()
const config = useRuntimeConfig()
const { getDashboardSummary } = useDashboardRequests()
const summary = ref<any>({ total_stock_value: 0, low_stock_items: 0, transactions_today: 0, top_category: null, top_category_value: 0, recent_transactions: [] })
const transactionColumns = [{ accessorKey: 'type', header: 'Type' }, { accessorKey: 'quantity', header: 'Quantity' }, { accessorKey: 'created_at', header: 'Date' }]
const formatMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ZAR' }).format(value || 0)
if (user.value.company.id && token.value) summary.value = await getDashboardSummary(config.public.apiBase, token.value, user.value.company.id) || summary.value
definePageMeta(
    {
        layout: 'main'
    }
)
</script>