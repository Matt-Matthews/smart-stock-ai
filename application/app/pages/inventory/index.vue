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
                <p class="text-sm">Restock low-stock items now could help prevent stock outs.</p>
                <NuxtButton variant="solid" :trailing-icon="'i-lucide-sparkles'" class="w-fit text-white text-sm mt-3">
                    Review Analytics</NuxtButton>
            </div>
        </div>
        <div class="bg-elevated w-full mt-6 rounded-sm p-4 flex items-center gap-4 shadow-sm dark:shadow-gray-700/30">
            <p>Filters</p>
            <NuxtSelect placeholder="Select Category" :items="items" />
            <NuxtSelect placeholder="Select Status" :items="items" />
            <NuxtButton variant="outline" color="primary" class="ml-auto">Apply Filters</NuxtButton>
            <NuxtButton variant="outline" color="primary">Clear Filters</NuxtButton>
        </div>
        <div class="mt-6 border rounded-sm border-muted p-4">
            <NuxtTable :data="inventoryItems" :columns="columns" class="flex-1" ref="table" />
            <div class="flex justify-end border-t border-default pt-4 px-4">
                <NuxtPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                    :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                    :total="table?.tableApi?.getFilteredRowModel().rows.length"
                    @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
            </div>
        </div>
        <div class="w-full mt-6 flex justify-end">
            <NuxtButton class="text-white">
                <NuxtIcon name="i-lucide-plus" class="text-[20px]" />
                Add Inventory Item
            </NuxtButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'


const UButton = resolveComponent('NuxtButton')
const UBadge = resolveComponent('NuxtBadge')
const UDropdownMenu = resolveComponent('NuxtDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()

const table = useTemplateRef('table')


const inventoryItems = ref([])
// const getInventories = async () => {
const config = useRuntimeConfig()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const authToken = useAuthToken()
const companyId = user.value?.company.id

const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')


const { data, error } = await useFetch(config.public.apiBase + '/graphql', {
    headers: {
        Authorization: `Bearer ${authToken.value}`
    },
    method: 'POST',
    body: {
        query: `
                query InventoryByCompany {
                    inventoryByCompany(company_id: "${companyId}") {
                        _id
                        company_id
                        product_id
                        quantity
                        created_at
                        updated_at
                        deleted_at
                        product {
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
                        event_hash
                    }
                }
            `,
        variables: {}
    },
})

if (error.value) {
    toast.add({
        title: 'Error',
        description: error.value?.data?.message || 'Failed to fetch inventory data.',
        color: 'error',
    })
} else {
    inventoryItems.value = (data.value as any)?.data?.inventoryByCompany || []
}


definePageMeta({
    layout: 'main'
})

type InventoryItem = {
    company_id: string;
    created_at: string;
    deleted_at: null | string;
    event_hash: null | string;
    product: {
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
    };
    product_id: string;
    quantity: number;
    updated_at: string;
    _id: string;
};



const columns: TableColumn<InventoryItem>[] = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `${Number(row.id) + 1}`
    },
    {
        accessorKey: 'product',
        header: 'Product',
        cell: ({ row }) => (row.getValue('product') as any)?.name || 'N/A'
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => (row.getValue('product') as any)?.sku || 'N/A'
    },
    {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => row.getValue('quantity')
    },
    {
        accessorKey: 'product',
        header: 'Selling Price',
        cell: ({ row }) => {
            const price = (row.getValue('product') as any)?.selling_price
            if (price == null) return 'N/A'

            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(price)
        }
    },
    {
        accessorKey: 'product',
        header: 'Cost Price',
        cell: ({ row }) => {
            const price = (row.getValue('product') as any)?.cost_price
            if (price == null) return 'N/A'

            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'EUR'
            }).format(price)
        }
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const color = {
                paid: 'success' as const,
                'Low Stock': 'error' as const,
                refunded: 'neutral' as const
            }[row.getValue('status') as string || 'Low Stock']

            return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
                row.getValue('status') || 'Low Stock'
            )
        }
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

function getRowItems(row: Row<InventoryItem>) {
    return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
        label: 'Copy Product SKU',
            onSelect() {
                copy(row.original.product.sku)

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
        {
            label: 'View inventory history'
        }
    ]
}
</script>