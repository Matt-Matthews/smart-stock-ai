<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center justify-between gap-2">
            <div>
                <h1 class="font-bold text-4xl">Invoice Items</h1>
                <p class="text-sm">Review the products recorded on supplier invoices.</p>
            </div>
            <NuxtButton class="text-white" @click="itemModal = true"><NuxtIcon name="i-lucide-plus" class="text-[20px]" /> Add Invoice Item</NuxtButton>
        </div>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class="w-full flex items-center gap-4">
                <NuxtIcon name="i-lucide-list-filter" class="text-muted" />
                <NuxtInput v-model="search" placeholder="Search by invoice or item id" class="w-80" />
                <NuxtButton variant="outline" color="primary" class="ml-auto" @click="search = ''">Clear Filters</NuxtButton>
            </div>
        </NuxtCard>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <NuxtTable :data="filteredItems" :columns="columns" ref="table" class="flex-1" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="table?.tableApi?.getFilteredRowModel().rows.length" @update:page="(page) => table?.tableApi?.setPageIndex(page - 1)" />
            </div>
        </NuxtCard>
        <NuxtModal v-model:open="itemModal" title="Add Invoice Item" description="Add a product line to an invoice." :ui="{ footer: 'justify-end' }">
            <template #body>
                <form id="invoice-item-form" class="flex flex-col gap-4" @submit.prevent="submitItem">
                    <NuxtFormField label="Invoice ID"><NuxtInput v-model="itemForm.invoiceId" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Item ID"><NuxtInput v-model="itemForm.itemId" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Quantity"><NuxtInput v-model.number="itemForm.quantity" type="number" min="1" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Price"><NuxtInput v-model.number="itemForm.price" type="number" min="0" required class="w-full" /></NuxtFormField>
                </form>
            </template>
            <template #footer="{ close }"><NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" /><NuxtButton label="Submit" form="invoice-item-form" type="submit" color="neutral" /></template>
        </NuxtModal>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
const invoiceItemStore = useInvoiceItemStore()
const { invoiceItems } = storeToRefs(invoiceItemStore)
const { listInvoiceItems, addInvoiceItem } = useInvoiceItemRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const search = ref('')
const itemModal = ref(false)
const itemForm = reactive({ invoiceId: '', itemId: '', quantity: 1, price: 0 })
const table = useTemplateRef<any>('table')
const columns: TableColumn<any>[] = [
    { accessorKey: 'id', header: '#', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'invoice_id', header: 'Invoice ID' },
    { accessorKey: 'item_id', header: 'Item ID' },
    { accessorKey: 'quantity', header: 'Quantity' },
    { accessorKey: 'price', header: 'Price', cell: ({ row }) => formatMoney(row.original.price) },
    { accessorKey: 'created_at', header: 'Created At', cell: ({ row }) => formatDate(row.original.created_at) }
]
const formatMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ZAR' }).format(value || 0)
const formatDate = (value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    const numericValue = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : NaN
    const date = Number.isFinite(numericValue) ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue) : new Date(value)
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toDateString()
}
const filteredItems = computed(() => invoiceItems.value.filter(item => `${item.invoice_id} ${item.item_id}`.toLowerCase().includes(search.value.toLowerCase())))
async function submitItem() {
    const invoiceItem = await addInvoiceItem(config.public.apiBase, authToken.value!, itemForm)
    if (invoiceItem?.id) invoiceItemStore.addInvoiceItem(invoiceItem)
    itemForm.invoiceId = ''; itemForm.itemId = ''; itemForm.quantity = 1; itemForm.price = 0; itemModal.value = false
}
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
if (user.value.company.id && authToken.value) {
    const invoices = await useInvoiceRequests().listInvoices(config.public.apiBase, authToken.value, user.value.company.id)
    const results = await Promise.all(invoices.map((invoice: any) => listInvoiceItems(config.public.apiBase, authToken.value!, invoice.id)))
    invoiceItemStore.setInvoiceItems(results.flat())
}
definePageMeta({ layout: 'main' })
</script>