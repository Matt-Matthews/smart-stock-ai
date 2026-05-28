import { defineStore } from 'pinia'
import type { User } from '~/types/userTypes'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {
            firstName: '',
            lastName: '',
            email: '',
            company: {
                id: '',
                name: ''
            }
        }
    }),
    actions: {
        setUser(user: User) {
            this.user = user;
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})