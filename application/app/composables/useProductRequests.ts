import type { ProductAdd } from "~/types/productTypes"

type ProductUpdate = {
    name: string
    description?: string
    cost_price: number
    sell_price: number
    category_id: string
    currency_id: string
    sku: string | null
    barcode: string | null
}

export const useProductRequests = () => {
    const toast = useToast()

    const listProducts = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                query ItemsByCompany {
                    itemsByCompany(companyId: "${companyId}") {
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
                            description
                        }
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
            return []
        } else {
            return (data.value as any)?.data?.itemsByCompany || []
        }
    }

    const addProduct = async (basePath: string, token: string, product: ProductAdd) => {

        const response = await $fetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                    mutation CreateItem {
                        createItem(
                            input: {
                                company_id: "${product.companyId}"
                                name: "${product.name}"
                                description: "${product.description}"
                                cost_price: ${product.costPrice}
                                sell_price: ${product.sellPrice}
                                sku: "${product.sku}"
                                barcode: "${product.barcode}"
                                category_id: "${product.categoryId}"
                                currency_id: "${product.currencyId}"
                            }
                        ) {
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
                `,
                variables: {}
            },
        })

        if ((response as any).errors) {
            const error = (response as any).errors[0]
            toast.add({
                title: 'Error',
                description: error.data?.message || 'Failed to create product data.',
                color: 'error',
            })

            return []
        } else {
            const data = (response as any).data
            return (data as any)?.createItem || []
        }

    }

    const getProduct = async (basePath: string, token: string, productId: string) => {
        const response = await $fetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                    query Item {
                        item(id: "${productId}") {
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
                                id
                                code
                                name
                            }
                            category {
                                id
                                company_id
                                name
                                description
                            }
                            inventory {
                                id
                                quantity
                                status
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
                description: error.data?.message || 'Failed to retrieve product data.',
                color: 'error',
            })

            return []
        } else {
            const data = (response as any).data
            return (data as any)?.item || []
        }
    }

    const updateProduct = async (basePath: string, token: string, productId: string, product: ProductUpdate) => {
        const response = await $fetch<{
            data?: { updateItem?: Record<string, unknown> }
            errors?: { message?: string }[]
        }>(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'POST',
            body: {
                query: `
                    mutation UpdateItem($id: String!, $input: UpdateItemInput!) {
                        updateItem(id: $id, input: $input) {
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
                `,
                variables: { id: productId, input: product }
            },
        })

        if (response.errors?.length) {
            const message = response.errors[0]?.message || 'Failed to update product.'
            toast.add({ title: 'Error', description: message, color: 'error' })
            throw new Error(message)
        }

        const updatedProduct = response.data?.updateItem
        if (!updatedProduct) {
            throw new Error('The server did not return the updated product.')
        }

        toast.add({ title: 'Success', description: 'Product updated successfully.', color: 'success' })
        return updatedProduct
    }

    return {
        listProducts,
        addProduct,
        getProduct,
        updateProduct
    }
}