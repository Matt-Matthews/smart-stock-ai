<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div class="flex items-center justify-between gap-4">
            <NuxtButton to="/inventory" variant="ghost" color="neutral" icon="i-lucide-arrow-left">Back to inventory</NuxtButton>
            <NuxtButton :to="`/products/${inventory.item?.id}`" variant="outline" color="neutral" icon="i-lucide-package">View product</NuxtButton>
        </div>

        <section class="flex flex-col justify-between gap-6 border-b border-default pb-6 md:flex-row md:items-end">
            <div class="flex items-start gap-4">
                <div class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><NuxtIcon name="i-lucide-warehouse" size="32" /></div>
                <div>
                    <div class="mb-2 flex flex-wrap items-center gap-2">
                        <NuxtChip color="neutral" variant="subtle">{{ inventory.item?.category?.name || 'Uncategorized' }}</NuxtChip>
                        <NuxtChip :color="statusColor" variant="subtle">{{ inventory.status }}</NuxtChip>
                    </div>
                    <h1 class="text-3xl font-bold tracking-tight md:text-4xl">{{ inventory.item?.name || 'Inventory item' }}</h1>
                    <p class="mt-1 font-mono text-sm text-muted">SKU {{ inventory.item?.sku || 'Not assigned' }} · Inventory ID {{ inventory.id }}</p>
                </div>
            </div>
            <div class="text-left md:text-right"><p class="text-sm text-muted">Current quantity</p><p class="text-4xl font-bold text-primary">{{ inventory.quantity }}</p></div>
        </section>

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <section class="rounded-xl border border-default bg-elevated p-6">
                <div class="mb-6 flex items-start justify-between gap-4">
                    <div><h2 class="text-xl font-semibold">Transaction history</h2><p class="text-sm text-muted">Every quantity change recorded for this inventory item.</p></div>
                    <NuxtChip color="neutral" variant="subtle">{{ inventory.transactions?.length || 0 }} records</NuxtChip>
                </div>
                <div v-if="inventory.transactions?.length" class="relative">
                    <div class="absolute bottom-3 left-3 top-3 w-px bg-default" />
                    <div v-for="transaction in inventory.transactions" :key="transaction.id" class="relative flex gap-4 pb-7 last:pb-0">
                        <div class="z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border-4 border-elevated bg-primary text-white"><span class="size-1.5 rounded-full bg-white" /></div>
                        <div class="min-w-0 flex-1 rounded-lg border border-default p-4">
                            <div class="flex flex-wrap items-start justify-between gap-3">
                                <div><p class="font-semibold capitalize">{{ transaction.type || 'Stock adjustment' }}</p><p class="mt-1 text-xs text-muted">{{ formatDate(transaction.created_at) }}</p></div>
                                <p :class="quantityClass(transaction)">{{ transaction.quantity > 0 ? '+' : '' }}{{ transaction.quantity }}</p>
                            </div>
                            <p class="mt-3 break-all font-mono text-xs text-muted">Transaction {{ transaction.id }}</p>
                        </div>
                    </div>
                </div>
                <NuxtEmpty v-else icon="i-lucide-history" title="No transactions yet" description="Quantity changes for this inventory item will appear here." variant="naked" />
            </section>

            <aside class="flex flex-col gap-6">
                <section class="rounded-xl border border-default bg-elevated p-6">
                    <h2 class="mb-5 text-lg font-semibold">Stock snapshot</h2>
                    <dl class="space-y-4 text-sm">
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Quantity</dt><dd class="text-xl font-bold">{{ inventory.quantity }}</dd></div>
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Status</dt><dd class="font-medium">{{ inventory.status }}</dd></div>
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Product</dt><dd class="max-w-40 truncate font-medium">{{ inventory.item?.name }}</dd></div>
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Currency</dt><dd class="font-medium">{{ inventory.item?.currency?.code || 'N/A' }}</dd></div>
                    </dl>
                </section>
                <section class="rounded-xl border border-default bg-elevated p-6">
                    <h2 class="mb-5 text-lg font-semibold">Record history</h2>
                    <dl class="space-y-4 text-sm">
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Created</dt><dd>{{ formatDate(inventory.created_at) }}</dd></div>
                        <div class="flex items-center justify-between gap-4"><dt class="text-muted">Updated</dt><dd>{{ formatDate(inventory.updated_at) }}</dd></div>
                    </dl>
                </section>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
const { getInventoryEntry } = useInventoryRequests()
const config = useRuntimeConfig()
const token = useAuthToken()
const route = useRoute()
const inventory = await getInventoryEntry(config.public.apiBase, token.value!, route.params.id as string)

if (!inventory) {
    throw createError({ statusCode: 404, statusMessage: 'Inventory item not found' })
}

const statusColor = computed(() => {
    if (inventory.status === 'In Stock') return 'success' as const
    if (inventory.status === 'Low Stock') return 'warning' as const
    if (inventory.status === 'Out of Stock') return 'error' as const
    return 'neutral' as const
})
const quantityClass = (transaction: { quantity: number }) => transaction.quantity > 0 ? 'font-bold text-success' : transaction.quantity < 0 ? 'font-bold text-error' : 'font-bold text-muted'
const formatDate = (value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    const numericValue = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : NaN
    const date = Number.isFinite(numericValue) ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue) : new Date(value)
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toDateString()
}

definePageMeta({ layout: 'main' })
</script>
