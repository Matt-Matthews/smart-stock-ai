<template>
    <div class="flex flex-col h-screen w-full">
        <div class="flex items-center w-full gap-2">
            <div class="w-1/2">
                <h1 class="font-bold text-4xl">Products</h1>
                <p class="text-sm">Manage your product items and their details.</p>
            </div>

            <div class="w-1/2 rounded-sm h-full flex items-center justify-end gap-2">
                <NuxtButton class="text-white">
                    <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
                    Add Product
                </NuxtButton>
                <NuxtButton variant="outline">
                    <NuxtIcon name="i-lucide-download" class="text-[20px]" />
                    Export
                </NuxtButton>
            </div>
        </div>
        <div class="bg-elevated w-full mt-6 rounded-sm p-4 flex items-center gap-4 shadow-sm dark:shadow-gray-700/30">
            <div class="flex items-center gap-2 text-muted text-sm rounded-sm px-3 py-1">
                <NuxtIcon name="i-lucide-list-filter" class="" />
                <p>Filters</p>
            </div>
            <NuxtSelect placeholder="Select Category" :items="items" />
            <NuxtSelect placeholder="Select Unit of Measure" :items="items" />
            <NuxtButton variant="outline" color="primary" class="ml-auto">Apply Filters</NuxtButton>
            <NuxtButton variant="outline" color="primary">Clear Filters</NuxtButton>
        </div>
        <div class="mt-6 border rounded-sm border-muted p-4">
            <NuxtTable :data="products" :columns="columns" class="flex-1" ref="table" />
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

import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'

type Product = {
    _id: string;
    company_id: string;
    name: string;
    description: string;
    cost_price: number;
    selling_price: number;
    sku: string;
    barcode: string;
    size: string;
    unit_of_measure: string;
    reorder_level: number;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
}

const UButton = resolveComponent('NuxtButton')
const UBadge = resolveComponent('NuxtBadge')
const UDropdownMenu = resolveComponent('NuxtDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

const table = useTemplateRef<any>('table')


const products = ref<Product[]>([])

const config = useRuntimeConfig()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const authToken = useAuthToken()
const companyId = user.value?.company.id;

const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')


const { data, error } = await useFetch(config.public.apiBase + '/graphql', {
    headers: {
        Authorization: `Bearer ${authToken.value}`
    },
    method: 'POST',
    body: {
        query: `
                query ProductsByCompany {
                    productsByCompany(companyId: "${companyId}") {
                        _id
                        company_id
                        name
                        description
                        cost_price
                        selling_price
                        sku
                        barcode
                        size
                        unit_of_measure
                        reorder_level
                        created_at
                        updated_at
                        deleted_at
                    }
                }
            `,
        variables: {}
    },
})

if (error.value) {
    toast.add({
        title: 'Error',
        description: error.value?.data?.message || 'Failed to fetch products data.',
        color: 'error',
    })
} else {
    products.value = (data.value as any)?.data?.productsByCompany || []
}





const columns: TableColumn<Product>[] = [
    {
        accessorKey: '_id',
        header: '#',
        meta: {
            class: {
                td: 'text-right',
                th: 'text-right'
            }
        },
        cell: ({ row }) => `${Number(row.id) + 1}`
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => row.getValue('name') || 'N/A'
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => row.getValue('sku') || 'N/A'
    },
    {
        accessorKey: 'barcode',
        header: 'Barcode',
        cell: ({ row }) => row.getValue('barcode') || 'N/A'
    },
    {
        accessorKey: 'selling_price',
        header: () => h('span', { class: 'text-right' }, 'Selling Price'),
        meta: {
            class: {
                td: 'text-right',
                th: 'text-right'
            }
        },
        cell: ({ row }) => {
            const price = (row.getValue('selling_price') as any)
            if (price == null) return 'N/A'
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(price)
            return h('span', { class: 'text-right' }, formattedPrice)
        }
    },
    {
        accessorKey: 'size',
        header: 'Size',
        cell: ({ row }) => row.getValue('size') || 'N/A',
        meta: {
            class: {
                td: 'text-center',
                th: 'text-center'
            }
        },
    },
    {
        accessorKey: 'unit_of_measure',
        header: 'Unit of Measure',
        cell: ({ row }) => row.getValue('unit_of_measure') || 'N/A',
        meta: {
            class: {
                td: 'text-center',
                th: 'text-center'
            }
        },
    },
    {
        accessorKey: 'reorder_level',
        header: 'Reorder Level',
        meta: {
            class: {
                td: 'text-center',
                th: 'text-center'
            }
        },
        cell: ({ row }) => row.getValue('reorder_level') || 'N/A'
    },
    {
        id: 'actions',
        meta: {
            class: {
                td: 'text-right'
            }
        },
        cell: ({ row }) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: 'end'
                    },
                    items: getRowItems(row),
                    'aria-label': 'Actions dropdown'
                },
                () =>
                    h(UButton, {
                        icon: 'i-lucide-ellipsis-vertical',
                        color: 'neutral',
                        variant: 'ghost',
                        'aria-label': 'Actions dropdown'
                    })
            )
        }
    }
]

function getRowItems(row: Row<Product>) {
    return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
            label: 'Copy Product SKU',
            onSelect() {
                copy(row.original.sku)

                toast.add({
                    title: 'Product SKU copied to clipboard!',
                    color: 'success',
                    icon: 'i-lucide-circle-check'
                })
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'View product details'
        },
    ]
}

definePageMeta(
    {
        layout: 'main'
    }
)
</script>