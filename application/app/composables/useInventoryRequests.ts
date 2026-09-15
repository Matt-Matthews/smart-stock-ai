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
        
        const response = await $fetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                mutation CreateInventoryEntry {
                    createInventoryEntry(company_id: "${item.companyId}", item_id: "${item.productId}", quantity: ${item.quantity}, status: "${item.status}") {
                        id
                        company_id
                        item_id
                        quantity
                        status
                        created_at
                        updated_at
                        deleted_at
                        event_hash
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
                        }
                    }
                }
            `,
                variables: {}
            },
        })

        
        if ((response as any).errors) {
            const error = (response as any).errors[0]
            toast.add({
                title: 'Error',
                description: error.data?.message || 'Failed to create inventory data.',
                color: 'error',
            })

            return []
        } else {
            const data = (response as any).data
            
            return (data as any)?.createInventoryEntry || []
        }
    }

    const getTransactionsByInventory = async (basePath: string, token: string, inventoryId: string) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` },
            method: 'POST',
            body: {
                query: `query($inventoryId: String!) {
                    transactionsByInventory(inventory_id: $inventoryId) {
                        id company_id inventory_id quantity type created_at updated_at deleted_at
                    }
                }`,
                variables: { inventoryId }
            }
        })
        if (response.errors) {
            toast.add({ title: 'Error', description: 'Failed to fetch inventory transactions.', color: 'error' })
            return []
        }
        return response.data?.transactionsByInventory || []
    }

    const getInventoryEntry = async (basePath: string, token: string, inventoryId: string) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` },
            method: 'POST',
            body: {
                query: `query($id: String!) {
                    inventoryEntry(id: $id) {
                        id company_id item_id quantity status event_hash created_at updated_at deleted_at
                        item { id name description sku barcode cost_price sell_price category { id name } currency { id code name } }
                    }
                }`,
                variables: { id: inventoryId }
            }
        })
        if (response.errors) {
            toast.add({ title: 'Error', description: 'Failed to fetch inventory history.', color: 'error' })
            return null
        }
        const inventory = response.data?.inventoryEntry
        if (!inventory) return null
        inventory.transactions = await getTransactionsByInventory(basePath, token, inventoryId)
        return inventory
    }

    return {
        listInventoryItems,
        addInventoryItem,
        getInventoryEntry,
        getTransactionsByInventory
    }
}