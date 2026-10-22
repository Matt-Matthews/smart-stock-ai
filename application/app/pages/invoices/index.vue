<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center justify-between gap-2">
            <div>
                <h1 class="font-bold text-4xl">Invoice Management</h1>
                <p class="text-sm">Manage supplier invoices and their totals.</p>
            </div>
            <!-- <NuxtButton class="text-white" @click="invoiceModal = true"><NuxtIcon name="i-lucide-plus" class="text-[20px]" /> Add Invoice</NuxtButton> -->
        </div>
        <div class="w-full min-h-56 mt-6 bg-elevated border border-dashed border-default rounded-md flex items-center justify-center p-6"
            :class="dragging ? 'border-primary bg-primary/5' : ''"
            @dragenter.prevent="dragging = true"
            @dragover.prevent="dragging = true"
            @dragleave.prevent="dragging = false"
            @drop.prevent="onDrop">
            <input ref="fileInput" type="file" accept="application/pdf,image/*" class="hidden" @change="submitOcr" />
            <div class="text-center">
                <NuxtIcon name="i-lucide-cloud-upload" class="text-primary mb-3" size="40" />
                <p class="font-semibold">Scan New Invoice</p>
                <p class="text-sm text-muted mt-1">Drag and drop a PDF or image here, or choose a file.</p>
                <NuxtButton color="primary" :loading="uploading" class="mt-4" @click="fileInput?.click()">Choose Invoice</NuxtButton>
            </div>
        </div>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class="w-full flex items-center gap-4">
                <NuxtIcon name="i-lucide-list-filter" class="text-muted" />
                <NuxtInput v-model="search" placeholder="Search by supplier or invoice id" class="w-80" />
                <NuxtButton variant="outline" color="primary" class="ml-auto" @click="() =>{search = ''}">Clear Filters</NuxtButton>
            </div>
        </NuxtCard>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <NuxtTable :data="filteredInvoices" :columns="columns" ref="table" class="flex-1" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="table?.tableApi?.getFilteredRowModel().rows.length" @update:page="(page) => table?.tableApi?.setPageIndex(page - 1)" />
            </div>
        </NuxtCard>
        <NuxtModal v-model:open="invoiceModal" title="Add Invoice" description="Create an invoice record." :ui="{ footer: 'justify-end' }">
            <template #body>
                <form id="invoice-form" class="flex flex-col gap-4" @submit.prevent="submitInvoice">
                    <NuxtFormField label="Supplier ID"><NuxtInput v-model="invoiceForm.supplierId" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Amount"><NuxtInput v-model.number="invoiceForm.amount" type="number" min="0" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="VAT"><NuxtInput v-model.number="invoiceForm.vat" type="number" min="0" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Total"><NuxtInput v-model.number="invoiceForm.total" type="number" min="0" required class="w-full" /></NuxtFormField>
                </form>
            </template>
            <template #footer="{ close }"><NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" /><NuxtButton label="Submit" form="invoice-form" type="submit" color="neutral" /></template>
        </NuxtModal>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
const invoiceStore = useInvoiceStore()
const { invoices } = storeToRefs(invoiceStore)
const { listInvoices, addInvoice } = useInvoiceRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const { user } = storeToRefs(useUserStore())
const search = ref('')
const invoiceModal = ref(false)
const invoiceForm = reactive({ supplierId: '', amount: 0, vat: 0, total: 0 })
const table = useTemplateRef<any>('table')
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const uploading = ref(false)
const dragging = ref(false)
const toast = useToast()
const columns: TableColumn<any>[] = [
    { accessorKey: 'id', header: '#', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'supplier_id', header: 'Supplier' },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatMoney(row.original.amount) },
    { accessorKey: 'vat', header: 'VAT', cell: ({ row }) => formatMoney(row.original.vat) },
    { accessorKey: 'total', header: 'Total', cell: ({ row }) => formatMoney(row.original.total) },
    { accessorKey: 'created_at', header: 'Created At', cell: ({ row }) => formatDate(row.original.created_at) }
]
const formatMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'ZAR' }).format(value || 0)
const formatDate = (value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    const numericValue = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : NaN
    const date = Number.isFinite(numericValue) ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue) : new Date(value)
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toDateString()
}
const filteredInvoices = computed(() => invoices.value.filter(invoice => `${invoice.id} ${invoice.supplier_id}`.toLowerCase().includes(search.value.toLowerCase())))
async function submitInvoice() {
    const invoice = await addInvoice(config.public.apiBase, authToken.value!, { ...invoiceForm, companyId: user.value.company.id })
    if (invoice?.id) invoiceStore.addInvoice(invoice)
    invoiceForm.supplierId = ''; invoiceForm.amount = 0; invoiceForm.vat = 0; invoiceForm.total = 0; invoiceModal.value = false
}
async function submitOcr(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    await uploadOcrFile(file)
}
async function onDrop(event: DragEvent) {
    dragging.value = false
    await uploadOcrFile(event.dataTransfer?.files?.[0])
}
async function uploadOcrFile(file?: File) {
    if (!file) return
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.add({ title: 'Invalid file', description: 'Please upload a PDF or image file.', color: 'error' })
        return
    }
    uploading.value = true
    try {
        await $fetch(`${config.public.apiBase}/invoices/ocr`, { method: 'POST', body: file, headers: { Authorization: `Bearer ${authToken.value}`, 'Content-Type': file.type, 'X-Company-Id': user.value.company.id, 'X-User-Id': user.value.id, 'X-File-Name': file.name } })
        toast.add({ title: 'Invoice submitted', description: 'The invoice was submitted for OCR processing.', color: 'success' })
    } catch (error: any) {
        toast.add({ title: 'Upload failed', description: error?.data?.message || 'Unable to submit invoice.', color: 'error' })
    } finally { uploading.value = false; if (fileInput.value) fileInput.value.value = '' }
}
if (user.value.company.id && authToken.value) invoiceStore.setInvoices(await listInvoices(config.public.apiBase, authToken.value, user.value.company.id))
definePageMeta({ layout: 'main' })
</script>