export type InventoryItem = {
    company_id: string;
    created_at: string;
    deleted_at: null | string;
    event_hash: null | string;
    status: string;
    item: {
        id: string;
        company_id: string;
        name: string;
        description: string;
        cost_price: number;
        sell_price: number;
        sku: string;
        barcode: string;
        created_at: string;
        updated_at: string;
        deleted_at: null | string;
        currency: {
            code: string;
            name: string;
        }
        category: {
            name: string;
        }
    };
    item_id: string;
    quantity: number;
    updated_at: string;
    id: string;
};