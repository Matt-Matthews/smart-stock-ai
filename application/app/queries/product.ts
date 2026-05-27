

export const listProductsQuery = `
    query Products {
        products {
            _id
            company_id
            name
            description
            cost_price
            selling_price
            sku
            barcode
            size
            unit_of_measure
            reorder_level
            created_at
            updated_at
            deleted_at
        }
    }
    `;

    /*
    const productList = useState<any[]>('products', () => []);
const getAllProducts = async () => {
    const { data, pending, error } = await useFetch('http://localhost:5000/api/v1/graphql', {
        method: 'POST',
        body: {
            query: `
                query Products {
                    products {
                        _id
                        company_id
                        name
                        description
                        cost_price
                        selling_price
                        sku
                        barcode
                        size
                        unit_of_measure
                        reorder_level
                        created_at
                        updated_at
                        deleted_at
                    }
                }
            `,
            variables: {} // Add your variables here
        },
        // Optional: Set headers (e.g., Auth)
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN'
        }
    });

    if (error.value) {
        console.error('Error fetching products:', error.value);
        return;
    }
    if (data.value) {
        productList.value = (data.value as { data: { products: any[] } }).data.products;
    }
};

onMounted(() => {
    getAllProducts();
});
*/