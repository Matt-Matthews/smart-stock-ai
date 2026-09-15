export const useInvoiceItemRequests = () => {
    const toast = useToast()
    const fields = 'id invoice_id item_id quantity price created_at updated_at deleted_at'
    const listInvoiceItems = async (basePath: string, token: string, invoiceId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `query { invoiceItemsByInvoice(invoice_id: "${invoiceId}") { ${fields} } }` } })
        if (error.value) { toast.add({ title: 'Error', description: 'Failed to fetch invoice items.', color: 'error' }); return [] }
        return (data.value as any)?.data?.invoiceItemsByInvoice || []
    }
    const addInvoiceItem = async (basePath: string, token: string, invoiceItem: { invoiceId: string, itemId: string, quantity: number, price: number }) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation { createInvoiceItem(invoice_id: "${invoiceItem.invoiceId}", item_id: "${invoiceItem.itemId}", quantity: ${invoiceItem.quantity}, price: ${invoiceItem.price}) { ${fields} } }` } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to add invoice item.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Invoice item added successfully.', color: 'success' }); return response.data.createInvoiceItem
    }
    const updateInvoiceItem = async (basePath: string, token: string, id: string, input: Record<string, unknown>) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!, $input: UpdateInvoiceItemInput!) { updateInvoiceItem(id: $id, input: $input) { ${fields} } }`, variables: { id, input } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to update invoice item.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Invoice item updated successfully.', color: 'success' }); return response.data.updateInvoiceItem
    }
    const deleteInvoiceItem = async (basePath: string, token: string, id: string) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!) { deleteInvoiceItem(id: $id) { id deleted_at } }`, variables: { id } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to delete invoice item.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Invoice item deleted successfully.', color: 'success' }); return response.data.deleteInvoiceItem
    }
    return { listInvoiceItems, addInvoiceItem, updateInvoiceItem, deleteInvoiceItem }
}