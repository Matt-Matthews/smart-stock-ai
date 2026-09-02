<template>
    <div class="flex flex-col flex-1 h-full">
        <div class="flex w-full gap-3">
            <DashTrendCard trend="up" comment="vs last month" value="100000" label="Total Stock Value"
                :trendValue="5" />
            <DashTrendCard trend="down" comment="vs last week" value="50" label="Low Stock Items" :trendValue="-5"
                valueType="count" icon="i-lucide-alert-triangle" />
            <DashTrendCard trend="up" comment="vs yesterday" value="75" label="Transactions Today" :trendValue="12"
                valueType="count" icon="i-lucide-receipt-text" />
            <DashTrendCard trend="neutral" comment="45% of total value" value="Stationery" label="Top Category"
                :trendValue="0" valueType="text" icon="i-lucide-circle-pile" />
        </div>
        <NuxtCard variant="soft" class="w-full p-2 mt-3">
            <p>Total Sales</p>
            <div>
                <NuxtEmpty icon="i-lucide-file" title="No total sales found"
                    description="It looks like you haven't added any sales. Create one to get started."
                    variant="naked" />
            </div>
        </NuxtCard>
        <div class="flex gap-3 mt-3 w-full">
            <NuxtCard variant="soft" class="w-1/2 p-2">
                <p>Recent Transactions</p>
                <div>
                    <NuxtEmpty icon="i-lucide-file" title="No recent transactions found"
                        description="It looks like you haven't added any transactions. Create one to get started."
                        variant="naked" />
                </div>
            </NuxtCard>
            <NuxtCard variant="soft" class="w-1/2 p-2">
                <p>AI Insights</p>
                <div>
                    <NuxtEmpty icon="i-lucide-file" title="No AI insights found"
                        description="It looks like you haven't generated any AI insights. Create one to get started."
                        variant="naked" />
                </div>
            </NuxtCard>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta(
    {
        layout: 'main'
    }
)
</script>