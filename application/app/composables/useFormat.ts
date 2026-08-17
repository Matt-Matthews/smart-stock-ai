export const useFormat = () => {
    const formatAmount = (amount: number) => {
        if(!Number.isInteger(amount)){
            return amount
        }
        
        return `${amount}.00`
    }

    return {
        formatAmount
    }
}