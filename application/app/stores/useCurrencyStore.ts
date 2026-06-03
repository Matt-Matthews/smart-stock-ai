import { defineStore } from 'pinia'
import type { Currency } from '~/types/currencyTypes'

export const useCurrencyStore = defineStore('currencyStore', {
    state: () => ({
        currencies: [] as Currency[]
    }),
    actions: {
        setCurrencies(currencies: Currency[]) {
            this.currencies = currencies;
        },
        addCurrency(currency: Currency) {
            this.currencies.push(currency);
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})