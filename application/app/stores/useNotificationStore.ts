import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notificationStore', {
    state: () => ({ notifications: [] as any[] }),
    getters: { unreadCount: (state) => state.notifications.filter(notification => !notification.read_at).length },
    actions: {
        setNotifications(notifications: any[]) { this.notifications = notifications },
        markRead(id: string) { const notification = this.notifications.find(item => item.id === id); if (notification) notification.read_at = new Date().toISOString() },
        clearStore() { this.$reset() }
    },
    persist: true
})

export const clearStore = () => useNotificationStore().clearStore()