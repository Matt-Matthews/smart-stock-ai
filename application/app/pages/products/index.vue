<template>
    <div class="flex flex-col flex-1">
        <div class="flex items-center w-full gap-2">
            <div class="w-1/2">
                <h1 class="font-bold text-4xl">Products</h1>
                <p class="text-sm">Manage your product items and their details.</p>
            </div>

            <div class="w-1/2 rounded-sm h-full flex items-center justify-end gap-2">
                <AddProduct @submitted="onSubmitted" />
                <NuxtButton variant="outline">
                    <NuxtIcon name="i-lucide-download" class="text-[20px]" />
                    Export
                </NuxtButton>
            </div>
        </div>
        <div class=" w-full mt-6 rounded-sm p-4 flex items-center gap-4 border border-muted">
            <div class="flex items-center gap-2 text-muted text-sm rounded-sm px-3 py-1">
                <NuxtIcon name="i-lucide-list-filter" class="" />
                <p>Filters</p>
            </div>
            <NuxtSelect placeholder="Select Category" class="w-48" v-model="selectedCategory"
                :items="categoryOPtions" />
            <NuxtSelect placeholder="Select Currency" class="w-48" v-model="selectedCurrency"
                :items="currencyOptions" />
            <NuxtChip class="ml-auto" :show="hasFiltersApplied">
                <NuxtButton color="primary" class="text-white" @click="applyFilters">
                    Apply Filters
                </NuxtButton>
            </NuxtChip>
            <NuxtButton variant="outline" color="primary" @click="clearFilters">
                Clear Filters
            </NuxtButton>
        </div>
        <div class="mt-6 border rounded-sm border-muted p-4">
            <NuxtTable :data="filteredProducts" :pagination="pagination" :pagination-options="{
                getPaginationRowModel: getPaginationRowModel()
            }" :columns="columns" class="flex-1" ref="table" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { resolveComponent } from 'vue'
import type { Product } from '~/types/productTypes'
import { getPaginationRowModel } from '@tanstack/vue-table'

const selectedCategory = ref('')
const selectedCurrency = ref('')
const hasFiltersApplied = ref(false)

const categoryStore = useCategoryStore()
const currencyStore = useCurrencyStore()

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const itemStore = useItemStore()

const { categories } = storeToRefs(categoryStore)
const { currencies } = storeToRefs(currencyStore)

const categoryOPtions = computed(() => categories.value?.map(c => c.name) ?? [])
const currencyOptions = computed(() => currencies.value?.map(c => c.code) ?? [])

const onSubmitted = (value: any) => {
    
    filteredProducts.value.push(value)
}

const UButton = resolveComponent('NuxtButton')
const UDropdownMenu = resolveComponent('NuxtDropdownMenu')
const { columns } = useProductColumns(UButton, UDropdownMenu)
const table = useTemplateRef<any>('table')

const { items } = storeToRefs(itemStore)
const products = items as unknown as Ref<Product[]>
const filteredProducts = ref<Product[]>([])

table.value?.tableApi.setPageSize(10)

const config = useRuntimeConfig()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const authToken = useAuthToken()
const companyId = user.value?.company.id;

const { listProducts } = useProductRequests()

if (companyId && authToken.value) {
    const result = await listProducts(config.public.apiBase, authToken.value, companyId);
    console.log('Products fetched:', result);
    // populate item store so other parts of the app react to changes
    itemStore.setItems(result)
    filteredProducts.value = result
}

const clearFilters = () => {
    selectedCategory.value = '',
        selectedCurrency.value = ''
    filteredProducts.value = products.value
    hasFiltersApplied.value = false
}

const applyFilters = () => {
    hasFiltersApplied.value = selectedCategory.value !== '' ||
        selectedCurrency.value !== '';

    filteredProducts.value = products.value.filter(product => {
        const matchesCategory = selectedCategory.value ? product.category.name === selectedCategory.value : true
        const matchesCurrency = selectedCurrency.value ? product.currency.code === selectedCurrency.value : true

        return matchesCategory && matchesCurrency
    })
}

watch([products, selectedCategory, selectedCurrency], () => {
    if (selectedCategory || selectedCurrency) {
        applyFilters()

    } else clearFilters()
}, { immediate: true })

definePageMeta(
    {
        layout: 'main'
    }
)
</script>