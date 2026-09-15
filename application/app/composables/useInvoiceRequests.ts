export const useInvoiceRequests = () => {
    const toast = useToast()
    const fields = 'id supplier_id company_id amount vat total created_at updated_at deleted_at'

    const listInvoices = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `query { invoicesByCompany(company_id: "${companyId}") { ${fields} } }` } })
        if (error.value) { toast.add({ title: 'Error', description: 'Failed to fetch invoices.', color: 'error' }); return [] }
        return (data.value as any)?.data?.invoicesByCompany || []
    }
    const addInvoice = async (basePath: string, token: string, invoice: { supplierId: string, companyId: string, amount: number, vat: number, total: number }) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation { createInvoice(supplier_id: "${invoice.supplierId}", company_id: "${invoice.companyId}", amount: ${invoice.amount}, vat: ${invoice.vat}, total: ${invoice.total}) { ${fields} } }` } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to add invoice.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Invoice added successfully.', color: 'success' }); return response.data.createInvoice
    }
    const updateInvoice = async (basePath: string, token: string, id: string, input: Record<string, unknown>) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!, $input: UpdateInvoiceInput!) { updateInvoice(id: $id, input: $input) { ${fields} } }`, variables: { id, input } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to update invoice.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Invoice updated successfully.', color: 'success' }); return response.data.updateInvoice
    }
    const deleteInvoice = async (basePath: string, token: string, id: string) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!) { deleteInvoice(id: $id) { id deleted_at } }`, variables: { id } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to delete invoice.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Invoice deleted successfully.', color: 'success' }); return response.data.deleteInvoice
    }
    return { listInvoices, addInvoice, updateInvoice, deleteInvoice }
}