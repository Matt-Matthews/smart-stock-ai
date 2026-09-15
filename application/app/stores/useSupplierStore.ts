import { defineStore } from 'pinia'

export const useSupplierStore = defineStore('supplierStore', {
    state: () => ({
        suppliers: [] as any[]
    }),
    actions: {
        setSuppliers(suppliers: any[]) {
            this.suppliers = suppliers
        },
        addSupplier(supplier: any) {
            this.suppliers.push(supplier)
        },
        updateSupplier(supplier: any) {
            const index = this.suppliers.findIndex(item => item.id === supplier.id)
            if (index !== -1) this.suppliers[index] = supplier
        },
        removeSupplier(supplierId: string) {
            this.suppliers = this.suppliers.filter(supplier => supplier.id !== supplierId)
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})