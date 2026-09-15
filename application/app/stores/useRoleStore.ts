import { defineStore } from 'pinia'

export const useRoleStore = defineStore('roleStore', {
    state: () => ({
        roles: [] as any[]
    }),
    actions: {
        setRoles(roles: any[]) {
            this.roles = roles
        },
        addRole(role: any) {
            this.roles.push(role)
        },
        updateRole(role: any) {
            const index = this.roles.findIndex(item => item.id === role.id)
            if (index !== -1) this.roles[index] = role
        },
        removeRole(roleId: string) {
            this.roles = this.roles.filter(role => role.id !== roleId)
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})