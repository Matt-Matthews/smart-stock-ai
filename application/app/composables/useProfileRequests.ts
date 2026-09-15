export const useProfileRequests = () => {
    const toast = useToast()
    const updateProfile = async (basePath: string, token: string, id: string, input: Record<string, string>) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: 'mutation($id: String!, $input: UpdateProfileInput!) { updateProfile(id: $id, input: $input) { id first_name last_name email company_id role_id enabled } }', variables: { id, input } } })
        if (response.errors) { toast.add({ title: 'Error', description: 'Failed to update profile.', color: 'error' }); return null }
        toast.add({ title: 'Success', description: 'Profile updated successfully.', color: 'success' })
        return response.data?.updateProfile
    }
    return { updateProfile }
}