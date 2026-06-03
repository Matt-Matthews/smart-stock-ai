import { defineStore } from 'pinia'

export const useItemStore = defineStore('itemStore', {
    state: () => ({
        items: [] as any[],
    }),
    actions: {
        setItems(items: any[]) {
            this.items = items;
        },
        addItem(item: any) {
            this.items.push(item);
        },
        clearStore() {
            this.$reset()
        },
        removeItem(itemId: string) {
            this.items = this.items.filter(item => item.id !== itemId);
        }
    },
    persist: true
})