export const useSupplierRequests = () => {
    const toast = useToast()

    const listSuppliers = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` },
            method: 'POST',
            body: { query: `query { suppliersByCompany(company_id: "${companyId}") { id name description company_id created_at updated_at deleted_at } }` }
        })
        if (error.value) {
            toast.add({ title: 'Error', description: 'Failed to fetch suppliers.', color: 'error' })
            return []
        }
        return (data.value as any)?.data?.suppliersByCompany || []
    }

    const addSupplier = async (basePath: string, token: string, supplier: { companyId: string, name: string, description?: string }) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `mutation { createSupplier(company_id: "${supplier.companyId}", name: "${supplier.name}", description: "${supplier.description || ''}") { id name description company_id created_at updated_at deleted_at } }` }
        })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to add supplier.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Supplier added successfully.', color: 'success' })
        return response.data.createSupplier
    }

    const updateSupplier = async (basePath: string, token: string, id: string, input: Record<string, unknown>) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `mutation($id: String!, $input: UpdateSupplierInput!) { updateSupplier(id: $id, input: $input) { id name description company_id created_at updated_at deleted_at } }`, variables: { id, input } }
        })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to update supplier.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Supplier updated successfully.', color: 'success' })
        return response.data.updateSupplier
    }

    const deleteSupplier = async (basePath: string, token: string, id: string) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `mutation($id: String!) { deleteSupplier(id: $id) { id name description company_id deleted_at } }`, variables: { id } }
        })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to delete supplier.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Supplier deleted successfully.', color: 'success' })
        return response.data.deleteSupplier
    }

    return { listSuppliers, addSupplier, updateSupplier, deleteSupplier }
}