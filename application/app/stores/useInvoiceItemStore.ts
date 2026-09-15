import { defineStore } from 'pinia'

export const useInvoiceItemStore = defineStore('invoiceItemStore', {
    state: () => ({
        invoiceItems: [] as any[]
    }),
    actions: {
        setInvoiceItems(invoiceItems: any[]) {
            this.invoiceItems = invoiceItems
        },
        addInvoiceItem(invoiceItem: any) {
            this.invoiceItems.push(invoiceItem)
        },
        updateInvoiceItem(invoiceItem: any) {
            const index = this.invoiceItems.findIndex(item => item.id === invoiceItem.id)
            if (index !== -1) this.invoiceItems[index] = invoiceItem
        },
        removeInvoiceItem(invoiceItemId: string) {
            this.invoiceItems = this.invoiceItems.filter(invoiceItem => invoiceItem.id !== invoiceItemId)
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})