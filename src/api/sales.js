// api/sales.js
// const API_URL = 'http://localhost:3001/api/sales';
const API_URL = 'http://192.168.0.104:3001/api/sales';

export const salesAPI = {
    getSales: async (page = 1, limit = 10) => {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch sales');
        return response.json();
    },
    createSale: async (saleData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saleData),
        });
        if (!response.ok) throw new Error('Failed to create sale');
        return response.json();
    },

    voidSale: async (sale_id) => {
        const response = await fetch(`${API_URL}/${sale_id}/void`, {
            method: 'PATCH',  // Make sure this is PATCH
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Void response status:', response.status); // Add logging
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Void error response:', errorText);
            throw new Error(`Failed to void sale: ${response.status}`);
        }
        return response.json();
    },

    refundSale: async (sale_id) => {
        const response = await fetch(`${API_URL}/${sale_id}/refund`, {
            method: 'PATCH',  // Make sure this is PATCH
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('Refund response status:', response.status); // Add logging
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Refund error response:', errorText);
            throw new Error(`Failed to refund sale: ${response.status}`);
        }
        return response.json();
    }
};