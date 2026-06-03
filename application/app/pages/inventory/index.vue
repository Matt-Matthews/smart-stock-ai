<template>
    <div class="flex flex-col h-screen w-full">
        <div class="flex items-center w-full gap-2">
            <div class="w-1/3">
                <h1 class="font-bold text-4xl">Inventory Overview</h1>
                <p class="text-sm">Manage your inventory items and their details.</p>
            </div>
            <div class="w-1/3 flex items-center gap-2 h-full">
                <InfoCard title="Total Products" :value="inventoryItems.length" :isPositive="true" trend="+10%" />
                <InfoCard title="Low Stock Items" value="3" :isPositive="false" trend="-20%" />
            </div>
            <div class="w-1/3 rounded-sm bg-blue-950 h-full p-4 flex flex-col gap-2 shadow-sm dark:shadow-gray-700/30">
                <p class="text-xs text-muted font-medium">AI Recommendation</p>
                <p class="text-sm text-white">Restock low-stock items now could help prevent stock outs.</p>
                <NuxtButton variant="solid" :trailing-icon="'i-lucide-sparkles'" class="w-fit text-white text-sm mt-3">
                    Review Analytics</NuxtButton>
            </div>
        </div>
        <div class="bg-elevated w-full mt-6 rounded-sm p-4 flex items-center gap-4 shadow-sm dark:shadow-gray-700/30">
            <div class="flex items-center gap-2 text-muted text-sm rounded-sm px-3 py-1">
                <NuxtIcon name="i-lucide-list-filter" class="" />
                <p>Filters</p>
            </div>
            <NuxtSelect placeholder="Select Category" class="w-48" v-model="selectedCategory"
                :items="categoryOPtions" />
            <NuxtSelect placeholder="Select Currency" class="w-48" v-model="selectedCurrency"
                :items="currencyOptions" />
            <NuxtSelect placeholder="Select Status" class="w-48" v-model="selectedStatus" :items="items" />
            <NuxtChip class="ml-auto" :show="hasFiltersApplied">
                <NuxtButton variant="outline" color="primary" @click="applyFilters">
                    Apply Filters
                </NuxtButton>
            </NuxtChip>
            <NuxtButton variant="outline" color="primary" @click="clearFilters">
                Clear Filters
            </NuxtButton>
        </div>
        <div class="mt-6 border rounded-sm border-muted p-4">
            <NuxtTable :data="filteredItems" :columns="columns" class="flex-1" ref="table" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
            </div>
        </div>
        <div class="w-full mt-6 flex justify-end">
            <!-- <NuxtButton class="text-white">
                <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
                Add Inventory Item
            </NuxtButton> -->
            <AddInventoryItem @submitted="onSubmitted" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { InventoryItem } from '~/types/inventoryTypes'
import { resolveComponent } from 'vue'

const table = useTemplateRef('table')
const inventoryItems: InventoryItem[] | any = ref([])
const filteredItems: InventoryItem[] | any = ref([])
const selectedCategory = ref('')
const selectedCurrency = ref('')
const selectedStatus = ref('')

const { columns } = useInventoryColumns(
    resolveComponent('NuxtButton'),
    resolveComponent('NuxtBadge'),
    resolveComponent('NuxtDropdownMenu')
);

const onSubmitted = (value: any) => {
    
    inventoryItems.value.push(value)
}


const config = useRuntimeConfig()
const authToken = useAuthToken()

const userStore = useUserStore()
const categoryStore = useCategoryStore()
const currencyStore = useCurrencyStore()

const { user } = storeToRefs(userStore)
const { categories } = storeToRefs(categoryStore)
const { currencies } = storeToRefs(currencyStore)

const categoryOPtions = computed(() => categories.value?.map(c => c.name) ?? [])
const currencyOptions = computed(() => currencies.value?.map(c => c.code) ?? [])
const companyId = user.value?.company.id

const items = ref(['In Stock', 'Low Stock', 'Out of Stock', 'Refunded'])

const { listInventoryItems } = useInventoryRequests()

if (companyId && authToken.value) {
    inventoryItems.value = await listInventoryItems(config.public.apiBase, authToken.value, companyId)
    filteredItems.value = inventoryItems.value
}

const applyFilters = () => {
    hasFiltersApplied.value = selectedCategory.value !== '' ||
        selectedCurrency.value !== '' || selectedStatus.value !== '';
    filteredItems.value = inventoryItems.value.filter((item: InventoryItem) => {
        const matchesCategory = selectedCategory.value ? item.item.category.name === selectedCategory.value : true
        const matchesCurrency = selectedCurrency.value ? item.item.currency.code === selectedCurrency.value : true
        const matchesStatus = selectedStatus.value ? item.status === selectedStatus.value : true

        return matchesCategory && matchesCurrency && matchesStatus
    })
}

const hasFiltersApplied = ref(false)

const clearFilters = () => {
    filteredItems.value = inventoryItems.value
    selectedCategory.value = ''
    selectedCurrency.value = ''
    selectedStatus.value = ''
    hasFiltersApplied.value = false
}

definePageMeta({
    layout: 'main'
})

</script>