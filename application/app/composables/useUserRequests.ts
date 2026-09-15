export const useUserRequests = () => {
    const toast = useToast()
    const fields = 'id first_name last_name email company_id role_id enabled created_at updated_at deleted_at role { id name }'

    const listUsers = async (basePath: string, token: string, companyId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `query($companyId: String!) { usersByCompany(company_id: $companyId) { ${fields} } }`, variables: { companyId } }
        })
        if (error.value) { toast.add({ title: 'Error', description: 'Failed to fetch users.', color: 'error' }); return [] }
        return (data.value as any)?.data?.usersByCompany || []
    }

    const addUser = async (basePath: string, token: string, user: { firstName: string, lastName: string, email: string, password: string, companyId: string, roleId: string }) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `mutation($input: CreateUserInput!) { createUser(input: $input) { ${fields} } }`, variables: { input: { first_name: user.firstName, last_name: user.lastName, email: user.email, password: user.password, company_id: user.companyId, role_id: user.roleId } } }
        })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to create user.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'User created successfully.', color: 'success' }); return response.data.createUser
    }

    const updateUser = async (basePath: string, token: string, id: string, input: Record<string, unknown>) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `mutation($id: String!, $input: UpdateUserInput!) { updateUser(id: $id, input: $input) { ${fields} } }`, variables: { id, input } }
        })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to update user.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'User updated successfully.', color: 'success' }); return response.data.updateUser
    }

    const deleteUser = async (basePath: string, token: string, id: string) => {
        const response = await $fetch<any>(basePath + '/graphql', {
            headers: { Authorization: `Bearer ${token}` }, method: 'POST',
            body: { query: `mutation($id: String!) { deleteUser(id: $id) { id deleted_at enabled } }`, variables: { id } }
        })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to delete user.', color: 'error' }); return [] }
        toast.add({ title: 'Success', description: 'User deleted successfully.', color: 'success' }); return response.data.deleteUser
    }

    return { listUsers, addUser, updateUser, deleteUser }
}