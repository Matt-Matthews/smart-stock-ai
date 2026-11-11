<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center justify-between gap-2">
            <div>
                <h1 class="font-bold text-4xl">Reports</h1>
                <p class="text-sm">Review and manage company reports.</p>
            </div>
            <NuxtButton class="text-white" @click="reportModal = true"><NuxtIcon name="i-lucide-plus" class="text-[20px]" /> Add Report</NuxtButton>
        </div>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class="w-full flex items-center gap-4">
                <NuxtIcon name="i-lucide-list-filter" class="text-muted" />
                <NuxtInput v-model="search" placeholder="Search reports" class="w-72" />
                <NuxtButton variant="outline" color="primary" class="ml-auto" @click="search = ''">Clear Filters</NuxtButton>
            </div>
        </NuxtCard>
        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <NuxtTable :data="filteredReports" :columns="columns" ref="table" class="flex-1" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="table?.tableApi?.getFilteredRowModel().rows.length" @update:page="(page) => table?.tableApi?.setPageIndex(page - 1)" />
            </div>
        </NuxtCard>
        <NuxtModal v-model:open="reportModal" title="Add Report" description="Create a report record." :ui="{ footer: 'justify-end' }">
            <template #body>
                <form id="report-form" class="flex flex-col gap-4" @submit.prevent="submitReport">
                    <NuxtFormField label="Name"><NuxtInput v-model="reportForm.name" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Description"><NuxtTextarea v-model="reportForm.description" class="w-full" /></NuxtFormField>
                </form>
            </template>
            <template #footer="{ close }">
                <NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" /><NuxtButton label="Submit" form="report-form" type="submit" color="neutral" />
            </template>
        </NuxtModal>
        <NuxtModal v-model:open="detailsModal" :title="selectedReport?.name || 'Report Details'" :description="selectedReport?.description || ''">
            <template #body>
                <p v-if="selectedReportData?.generatedAt" class="text-sm text-muted mb-4">
                    Generated {{ formatDate(selectedReportData.generatedAt) }}
                </p>
                <div v-if="selectedReportAlerts.length" class="flex flex-col gap-3">
                    <NuxtCard v-for="alert in selectedReportAlerts" :key="alert.itemId" variant="soft">
                        <div class="flex flex-wrap justify-between gap-2">
                            <h3 class="font-semibold">{{ alert.itemName }}</h3>
                            <span class="text-sm">Current stock: {{ alert.currentQuantity }}</span>
                        </div>
                        <p class="text-sm text-muted mt-2">
                            Average daily usage: {{ Number(alert.averageDailyUsage).toFixed(2) }} ·
                            Forecast: {{ Number(alert.forecastDaysLeft).toFixed(1) }} days ·
                            Recommended order: {{ alert.recommendedOrderQty }}
                        </p>
                        <p class="text-sm mt-2">{{ alert.reason }}</p>
                    </NuxtCard>
                </div>
                <p v-else-if="selectedReportData?.type === 'inventory_reorder'" class="text-sm text-muted">
                    No reorder alerts were found in this inventory check.
                </p>
                <p v-else class="text-sm text-muted">This report has no stored inventory results.</p>
            </template>
        </NuxtModal>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
const reportStore = useReportStore()
const { reports } = storeToRefs(reportStore)
const { listReports, addReport } = useReportRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const { user } = storeToRefs(useUserStore())
const search = ref('')
const reportModal = ref(false)
const detailsModal = ref(false)
const selectedReport = ref<any>(null)
const reportForm = reactive({ name: '', description: '' })
const table = useTemplateRef<any>('table')
const route = useRoute()
const parseReportData = (value: string | null | undefined) => {
    if (!value) return null
    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}
const reportSummary = (report: any) => {
    const data = parseReportData(report.data)
    return Array.isArray(data?.alerts) ? `${data.alerts.length} reorder alerts` : 'No stored results'
}
const selectedReportData = computed(() => parseReportData(selectedReport.value?.data))
const selectedReportAlerts = computed(() => Array.isArray(selectedReportData.value?.alerts) ? selectedReportData.value.alerts : [])
const showReport = (report: any) => {
    selectedReport.value = report
    detailsModal.value = true
}
const columns: TableColumn<any>[] = [
    { accessorKey: 'id', header: '#', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'name', header: 'Report Name' },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => row.original.description || 'N/A' },
    { accessorKey: 'data', header: 'Results', cell: ({ row }) => reportSummary(row.original) },
    { accessorKey: 'created_at', header: 'Created At', cell: ({ row }) => formatDate(row.original.created_at) },
    { accessorKey: 'updated_at', header: 'Updated At', cell: ({ row }) => formatDate(row.original.updated_at) },
    { id: 'actions', header: '', cell: ({ row }) => h(resolveComponent('NuxtButton'), { variant: 'outline', size: 'sm', onClick: () => showReport(row.original) }, () => 'View') }
]
const formatDate = (value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    const numericValue = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : NaN
    const date = Number.isFinite(numericValue) ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue) : new Date(value)
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toDateString()
}
const filteredReports = computed(() => reports.value.filter(report => `${report.name} ${report.description || ''}`.toLowerCase().includes(search.value.toLowerCase())))
async function submitReport() {
    const report = await addReport(config.public.apiBase, authToken.value!, { ...reportForm, companyId: user.value.company.id })
    if (report?.id) reportStore.addReport(report)
    reportForm.name = ''; reportForm.description = ''; reportModal.value = false
}
if (user.value.company.id && authToken.value) reportStore.setReports(await listReports(config.public.apiBase, authToken.value, user.value.company.id))
watch(() => route.query.reportId, reportId => {
    if (typeof reportId !== 'string') return
    const report = reports.value.find(item => item.id === reportId)
    if (report) showReport(report)
}, { immediate: true })
definePageMeta({ layout: 'main' })
</script>