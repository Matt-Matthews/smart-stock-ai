import type { Product } from "~/types/productTypes"
import { h } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'


export const useProductColumns = (UButton: any, UDropdownMenu: any) => {
    const { copy } = useClipboard()
    const toast = useToast()
    const router = useRouter()

    const columns: TableColumn<Product>[] = [
        {
            accessorKey: 'id',
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
            accessorKey: 'sell_price',
            header: () => h('span', { class: 'text-right' }, 'Selling Price'),
            meta: {
                class: {
                    td: 'text-right',
                    th: 'text-right'
                }
            },
            cell: ({ row }) => {
                const price = (row.getValue('sell_price') as any)
                const currency = (row.original.currency as any)?.code || 'ZAR'
                if (price == null) return 'N/A'
                const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                }).format(price)
                return h('span', { class: 'text-right' }, formattedPrice)
            },
        },
        {
            accessorKey: 'cost_price',
            header: () => h('span', { class: 'text-right' }, 'Cost Price'),
            meta: {
                class: {
                    td: 'text-right',
                    th: 'text-right'
                }
            },
            cell: ({ row }) => {

                const currency = (row.original.currency as any)?.code || 'ZAR'
                const price = (row.getValue('cost_price') as any)
                if (price == null) return 'N/A'
                const formattedPrice = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                }).format(price)
                return h('span', { class: 'text-right' }, formattedPrice)
            }
        },

        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => (row.getValue('category') as any)?.name || 'N/A',
            meta: {
                class: {
                    td: 'text-left',
                    th: 'text-left'
                }
            },
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
                label: 'View product details',
                onSelect() {
                    router.push(`/products/${row.original.id}`)
                }
            },
        ]
    }

    return {
        columns
    }
}