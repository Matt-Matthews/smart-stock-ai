export const useNotificationRequests = () => {
    const toast = useToast()
    const fields = 'id user_id company_id title message type read_at created_at updated_at'

    const listNotifications = async (basePath: string, token: string, userId: string) => {
        const { data, error } = await useFetch(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `query($userId: String!) { notificationsByUser(user_id: $userId) { ${fields} } }`, variables: { userId } } })
        if (error.value || (data.value as any)?.errors) { toast.add({ title: 'Error', description: 'Failed to fetch notifications.', color: 'error' }); return [] }
        return (data.value as any)?.data?.notificationsByUser || []
    }

    const markNotificationRead = async (basePath: string, token: string, id: string) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: `mutation($id: String!) { markNotificationRead(id: $id) { ${fields} } }`, variables: { id } } })
        return response.data?.markNotificationRead
    }

    const markAllNotificationsRead = async (basePath: string, token: string, userId: string) => {
        const response = await $fetch<any>(basePath + '/graphql', { headers: { Authorization: `Bearer ${token}` }, method: 'POST', body: { query: 'mutation($userId: String!) { markAllNotificationsRead(user_id: $userId) }', variables: { userId } } })
        return response.data?.markAllNotificationsRead === true
    }

    return { listNotifications, markNotificationRead, markAllNotificationsRead }
}