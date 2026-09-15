export const useDashboardRequests = () => {
    const toast = useToast()
    const getDashboardSummary = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `query($companyId: String!) { dashboardSummary(company_id: $companyId) { total_stock_value low_stock_items transactions_today top_category top_category_value recent_transactions { id quantity type created_at inventory { item_id } } } }`, variables: { companyId } } })
        if (error.value || (data.value as any)?.errors) { toast.add({ title: 'Error', description: 'Failed to fetch dashboard data.', color: 'error' }); return null }
        return (data.value as any)?.data?.dashboardSummary || null
    }
    return { getDashboardSummary }
}