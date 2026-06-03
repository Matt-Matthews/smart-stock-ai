import { defineStore } from 'pinia'
import type { Category } from '~/types/categoryTypes'

export const useCategoryStore = defineStore('categoryStore', {
    state: () => ({
        categories: [] as Category[]
    }), 
    actions: {
        setCategories(categories: Category[]) {
            this.categories = categories;
        },
        addCategory(category: Category) {
            this.categories.push(category);
        },
        clearStore() {
            this.$reset()
        },
        removeCategory(categoryId: string) {
            this.categories = this.categories.filter(category => category.id !== categoryId);
        }
    },
    persist: true
})