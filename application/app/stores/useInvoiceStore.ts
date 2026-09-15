import { defineStore } from 'pinia'

export const useInvoiceStore = defineStore('invoiceStore', {
    state: () => ({
        invoices: [] as any[]
    }),
    actions: {
        setInvoices(invoices: any[]) {
            this.invoices = invoices
        },
        addInvoice(invoice: any) {
            this.invoices.push(invoice)
        },
        updateInvoice(invoice: any) {
            const index = this.invoices.findIndex(item => item.id === invoice.id)
            if (index !== -1) this.invoices[index] = invoice
        },
        removeInvoice(invoiceId: string) {
            this.invoices = this.invoices.filter(invoice => invoice.id !== invoiceId)
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})