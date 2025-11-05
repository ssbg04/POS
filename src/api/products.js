// In your productsAPI
export const productsAPI = {
    getProducts: async (search = "", category = "all") => {
        try {
            let url = '/api/products';
            const params = new URLSearchParams();

            if (search) params.append('search', search);
            if (category && category !== 'all') params.append('category', category);

            if (params.toString()) url += `?${params.toString()}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    getProductByBarcode: async (barcode) => {
        try {
            const response = await fetch(`/api/products/barcode/${barcode}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};