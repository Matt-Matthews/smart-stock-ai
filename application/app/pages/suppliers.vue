<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center justify-between gap-2">
            <div>
                <h1 class="font-bold text-4xl">Suppliers</h1>
                <p class="text-sm">Manage your suppliers and their details.</p>
            </div>
            <NuxtButton class="text-white" @click="supplierModal = true">
                <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
                Add Supplier
            </NuxtButton>
        </div>

        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <div class="w-full flex items-center gap-4">
                <NuxtIcon name="i-lucide-list-filter" class="text-muted" />
                <NuxtInput v-model="search" placeholder="Search suppliers" class="w-72" />
                <NuxtButton variant="outline" color="primary" class="ml-auto" @click="search = ''">Clear Filters</NuxtButton>
            </div>
        </NuxtCard>

        <NuxtCard variant="soft" class="w-full p-0 mt-6">
            <NuxtTable :data="filteredSuppliers" :columns="columns" ref="table" class="flex-1" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="(page) => table?.tableApi?.setPageIndex(page - 1)" />
            </div>
        </NuxtCard>

        <NuxtModal v-model:open="supplierModal" title="Add Supplier" description="Create a supplier record."
            :ui="{ footer: 'justify-end' }">
            <template #body>
                <form id="supplier-form" class="flex flex-col gap-4" @submit.prevent="submitSupplier">
                    <NuxtFormField label="Name"><NuxtInput v-model="supplierForm.name" required class="w-full" /></NuxtFormField>
                    <NuxtFormField label="Description"><NuxtTextarea v-model="supplierForm.description" class="w-full" /></NuxtFormField>
                </form>
            </template>
            <template #footer="{ close }">
                <NuxtButton label="Cancel" color="neutral" variant="outline" @click="close" />
                <NuxtButton label="Submit" form="supplier-form" type="submit" color="neutral" />
            </template>
        </NuxtModal>
    </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

const supplierStore = useSupplierStore()
const { suppliers } = storeToRefs(supplierStore)
const { listSuppliers, addSupplier } = useSupplierRequests()
const config = useRuntimeConfig()
const authToken = useAuthToken()
const { user } = storeToRefs(useUserStore())
const search = ref('')
const supplierModal = ref(false)
const supplierForm = reactive({ name: '', description: '' })
const table = useTemplateRef<any>('table')

const columns: TableColumn<any>[] = [
    { accessorKey: 'id', header: '#', cell: ({ row }) => row.index + 1 },
    { accessorKey: 'name', header: 'Supplier Name' },
    { accessorKey: 'description', header: 'Description', cell: ({ row }) => row.original.description || 'N/A' },
    { accessorKey: 'created_at', header: 'Created At', cell: ({ row }) => formatDate(row.original.created_at) },
    { accessorKey: 'updated_at', header: 'Updated At', cell: ({ row }) => formatDate(row.original.updated_at) }
]

const formatDate = (value: string | number | Date | null | undefined) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    const numericValue = typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value)) ? Number(value) : NaN
    const date = Number.isFinite(numericValue) ? new Date(numericValue < 1e12 ? numericValue * 1000 : numericValue) : new Date(value)
    return Number.isNaN(date.getTime()) ? 'N/A' : date.toDateString()
}
const filteredSuppliers = computed(() => suppliers.value.filter(supplier =>
    `${supplier.name} ${supplier.description || ''}`.toLowerCase().includes(search.value.toLowerCase())
))

async function submitSupplier() {
    const supplier = await addSupplier(config.public.apiBase, authToken.value!, { ...supplierForm, companyId: user.value.company.id })
    if (supplier?.id) supplierStore.addSupplier(supplier)
    supplierForm.name = ''
    supplierForm.description = ''
    supplierModal.value = false
}

if (user.value.company.id && authToken.value) {
    supplierStore.setSuppliers(await listSuppliers(config.public.apiBase, authToken.value, user.value.company.id))
}

definePageMeta({ layout: 'main' })
</script>