export const useInventoryRequests = () => {
    const toast = useToast()

    const listInventoryItems = async (basePath: string, token: string, companyId: string) => {

        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                query InventoryByCompany {
                    inventoryByCompany(company_id: "${companyId}") {
                        id
                        company_id
                        item_id
                        quantity
                        created_at
                        updated_at
                        deleted_at
                        event_hash
                        status
                        item {
                            id
                            company_id
                            name
                            description
                            cost_price
                            sell_price
                            sku
                            barcode
                            currency_id
                            category_id
                            created_at
                            updated_at
                            deleted_at
                            currency {
                                code
                                name
                            }
                            category {
                                name
                            }
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

            return []
        } else {
            return (data.value as any)?.data?.inventoryByCompany || []
        }
    }

    const addInventoryItem = async (basePath: string, token: string, item: {companyId: string, productId: string, quantity: number, status: string}) => {
        
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                mutation: `
                mutation CreateInventoryEntry {
                    createInventoryEntry(company_id: "${item.companyId}", product_id: "${item.productId}", quantity: ${item.quantity}, status: "${item.status}") {
                        id
                        company_id
                        item_id
                        quantity
                        status
                        created_at
                        updated_at
                        deleted_at
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
                description: error.value?.data?.message || 'Failed to create inventory data.',
                color: 'error',
            })

            return []
        } else {
            return (data.value as any)?.data?.inventoryByCompany || []
        }
    }

    return {
        listInventoryItems,
        addInventoryItem
    }
}