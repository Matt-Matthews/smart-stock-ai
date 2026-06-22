export type Product = {
    _id: string;
    company_id: string;
    name: string;
    description: string;
    cost_price: number;
    selling_price: number;
    sku: string;
    barcode: string;
    size: string;
    unit_of_measure: string;
    category: {
        id: string;
        name: string;
    };
    currency: {
        code: string;
        name: string;
    }
    reorder_level: number;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
}

export type ProductAdd = {
    companyId: string;
    name: string;
    description?: string;
    costPrice: number;
    sellPrice: number;
    sku: string;
    barcode: string;
    categoryId: string;
    currencyId: string;
}