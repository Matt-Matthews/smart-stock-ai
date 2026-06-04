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

    return {
        listProducts
    }
}