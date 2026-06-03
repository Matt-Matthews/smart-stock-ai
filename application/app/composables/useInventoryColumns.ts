import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import type { InventoryItem } from '~/types/inventoryTypes'

export const useInventoryColumns = (UButton: any, UBadge: any, UDropdownMenu: any) => {


    const { copy } = useClipboard()
    const toast = useToast()

    const columns: TableColumn<InventoryItem>[] = [
        {
            accessorKey: 'id',
            header: '#',
            cell: ({ row }) => `${Number(row.id) + 1}`
        },
        {
            accessorKey: 'item',
            header: 'Product',
            cell: ({ row }) => (row.getValue('item') as any)?.name || 'N/A'
        },
        {
            accessorKey: 'item',
            header: 'Category',
            cell: ({ row }) => (row.getValue('item') as any)?.category?.name || 'N/A'
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: ({ row }) => (row.getValue('item') as any)?.sku || 'N/A'
        },
        {
            accessorKey: 'quantity',
            header: () => h('span', { class: 'text-center inline-block' }, 'Quantity'),
            cell: ({ row }) => h('span', { class: 'text-center w-14 inline-block' }, row.getValue('quantity'))
        },
        {
            accessorKey: 'item',
            header: 'Selling Price',
            cell: ({ row }) => {
                const price = (row.getValue('item') as any)?.sell_price
                const currency = (row.getValue('item') as any)?.currency?.code || 'ZAR'
                if (price == null) return 'N/A'

                return h('span', { class: 'text-right w-21 inline-block' }, new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                }).format(price))
            }
        },
        {
            accessorKey: 'item',
            header: 'Cost Price',
            cell: ({ row }) => {
                const price = (row.getValue('item') as any)?.cost_price
                const currency = (row.getValue('item') as any)?.currency?.code || 'ZAR'
                if (price == null) return 'N/A'

                return h('span', { class: 'text-right w-16 inline-block' }, new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                }).format(price))
            }

        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const color = {
                    'In Stock': 'success' as const,
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
                    copy(row.original.item.sku)

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

    return {
        columns
    }

}