import type { ProductAdd } from "~/types/productTypes"

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

    return {
        listProducts,
        addProduct
    }
}