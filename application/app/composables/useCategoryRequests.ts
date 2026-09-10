export const useCategoryRequests = () => {
    const toast = useToast()
    const addCategory = async (basePath: string, token: string, categoryData: any) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                    mutation createCategory {
                        createCategory (company_id: "${categoryData.companyId}", name: "${categoryData.name}", description: "${categoryData.description}") {
                            id
                            company_id
                            name
                            description
                            created_at
                            updated_at
                            deleted_at
                        }
                    }
                `,
                variables: {  }
            }
        })

        if (error.value || (data.value as any)?.errors) {
            
            toast.add({ title: 'Error', description: 'Failed to add category.', color: 'error' })
            throw error.value
        }
        // console.log('Category added successfully:', data.value)
        toast.add({ title: 'Success', description: 'Category added successfully.', color: 'success' })
        return data.value
    }

    const updateCategory = async (basePath: string, token: string, categoryId: string, categoryData: any) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                    mutation ($categoryId: String!, $categoryData: CategoryInput!) {
                        updateCategory(categoryId: $categoryId, categoryData: $categoryData) {
                            id
                            name
                            description
                        }
                    }
                `,
                variables: { categoryId, categoryData }
            }
        })

        if (error.value) {
            toast.add({ title: 'Error', description: 'Failed to update category.', color: 'error' })
            throw error.value
        }
        toast.add({ title: 'Success', description: 'Category updated successfully.', color: 'success' })
        return data.value
    }

    const deleteCategory = async (basePath: string, token: string, categoryId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            method: 'POST',
            body: {
                query: `
                    mutation ($categoryId: String!) {
                        deleteCategory(categoryId: $categoryId) {
                            id
                            name
                            description
                        }
                    }
                `,
                variables: { categoryId }
            }
        })
        if (error.value) {
            toast.add({ title: 'Error', description: 'Failed to delete category.', color: 'error' })
            throw error.value
        }
        toast.add({ title: 'Success', description: 'Category deleted successfully.', color: 'success' })
        return data.value
    }

    return { addCategory, updateCategory, deleteCategory }
}