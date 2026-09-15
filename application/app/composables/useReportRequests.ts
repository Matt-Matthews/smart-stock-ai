export const useReportRequests = () => {
    const toast = useToast()
    const fields = 'id name description company_id created_at updated_at deleted_at'
    const listReports = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `query { reportsByCompany(company_id: "${companyId}") { ${fields} } }` } })
        if (error.value) { toast.add({ title: 'Error', description: 'Failed to fetch reports.', color: 'error' }); return [] }
        return (data.value as any)?.data?.reportsByCompany || []
    }
    const addReport = async (basePath: string, token: string, report: { companyId: string, name: string, description?: string }) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation { createReport(company_id: "${report.companyId}", name: "${report.name}", description: "${report.description || ''}") { ${fields} } }` } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to add report.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Report added successfully.', color: 'success' }); return response.data.createReport
    }
    const updateReport = async (basePath: string, token: string, id: string, input: Record<string, unknown>) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!, $input: UpdateReportInput!) { updateReport(id: $id, input: $input) { ${fields} } }`, variables: { id, input } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to update report.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Report updated successfully.', color: 'success' }); return response.data.updateReport
    }
    const deleteReport = async (basePath: string, token: string, id: string) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!) { deleteReport(id: $id) { id deleted_at } }`, variables: { id } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to delete report.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'Report deleted successfully.', color: 'success' }); return response.data.deleteReport
    }
    return { listReports, addReport, updateReport, deleteReport }
}