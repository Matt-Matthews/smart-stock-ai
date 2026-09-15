import { defineStore } from 'pinia'

export const useManagedUserStore = defineStore('managedUserStore', {
    state: () => ({ users: [] as any[] }),
    actions: {
        setUsers(users: any[]) { this.users = users },
        addUser(user: any) { this.users.push(user) },
        updateUser(user: any) {
            const index = this.users.findIndex(item => item.id === user.id)
            if (index !== -1) this.users[index] = user
        },
        removeUser(userId: string) { this.users = this.users.filter(user => user.id !== userId) },
        clearStore() { this.$reset() }
    },
    persist: true
})