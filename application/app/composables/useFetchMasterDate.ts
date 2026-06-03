

export const useFetchMasterData = () => {
    const categoryStore = useCategoryStore();
    const currencyStore = useCurrencyStore();
    const itemStore = useItemStore();
    const toast = useToast()

    const fetchMasterData = async (basePath: string, token: string, companyId: string, callback: () => void) => {
        callback()
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
            query Items {
                categoriesByCompany(companyId: "${companyId}") {
                    id
                    company_id
                    name
                    description
                    created_at
                    updated_at
                    deleted_at
                }
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
                }
                currencies {
                    id
                    code
                    name
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
                title: 'Error fetching master data',
                description: 'An error occurred while fetching master data. Please try again.',
                color: 'error',
            })
        } else {
            categoryStore.setCategories((data.value as any).categoriesByCompany)
            itemStore.setItems((data.value as any).itemsByCompany)
            currencyStore.setCurrencies((data.value as any).currencies)
        }

        callback()
    }

    return {
        fetchMasterData
    }
}