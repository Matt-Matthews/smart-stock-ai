export const useRoleRequests = () => {
    const toast = useToast()

    const listRoles = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` },
            method: 'POST',
            body: {
                query: `query($companyId: String!) { rolesByCompany(company_id: $companyId) { id name description created_at updated_at deleted_at } }`,
                variables: { companyId }
            }
        })

        if (error.value || (data.value as any)?.errors) {
            toast.add({ title: 'Error', description: 'Failed to fetch roles.', color: 'error' })
            return []
        }

        return (data.value as any)?.data?.rolesByCompany || []
    }

    return { listRoles }
}