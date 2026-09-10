import type { TableColumn } from '@nuxt/ui'
import type { Category } from '~/types/categoryTypes'
import type { Row } from '@tanstack/vue-table'

export const useCategoryColumns = (UButton: any, UDropdownMenu: any) => {
    const columns: TableColumn<Category>[] = [
        {
            accessorKey: 'id',
            header: '#',
            cell: ({ row }) => `${Number(row.id) + 1}`
        },
        {
            accessorKey: 'name',
            header: 'Category Name',
            cell: ({ row }) => row.getValue('name')
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => row.getValue('description') || 'N/A'
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => new Date(Number(row.getValue('created_at'))).toDateString()
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated At',
            cell: ({ row }) => new Date(Number(row.getValue('updated_at'))).toDateString()
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

    function getRowItems(row: Row<Category>) {
        return [
            {
                type: 'label',
                label: 'Actions'
            },
            {
                label: 'Edit category',
                icon: 'i-lucide-pencil',
                onSelect() {

                },

            },
            {
                type: 'separator'
            },
            {
                label: 'Delete category',
                icon: 'i-lucide-trash-2',
                color: 'error',
                onSelect() {

                }
            },
        ]
    }

    return { columns }
}