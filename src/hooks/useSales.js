// hooks/useSales.js
import { useState, useEffect } from 'react';
import { salesAPI } from '../api/sales';

export const useSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalSales: 0,
        hasNext: false,
        hasPrev: false
    });

    const fetchSales = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError(null);
            const { sales: salesData, pagination: paginationData } = await salesAPI.getSales(page, limit);
            setSales(salesData);
            setPagination(paginationData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= pagination.totalPages) {
            fetchSales(page);
        }
    };

    const createSale = async (saleData) => {
        try {
            setLoading(true);
            setError(null);
            const newSale = await salesAPI.createSale(saleData);
            setSales(prev => [newSale, ...prev]);
            return newSale;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // hooks/useSales.js
    const voidSale = async (sale_id) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Attempting to void sale:', sale_id); // Add this
            const result = await salesAPI.voidSale(sale_id);
            console.log('Void successful:', result); // Add this

            setSales(prev => prev.map(sale =>
                sale.sale_id === sale_id
                    ? { ...sale, status: 'voided' }
                    : sale
            ));

            return result;
        } catch (err) {
            console.error('Void sale error in hook:', err); // Add this
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refundSale = async (sale_id) => {
        try {
            setLoading(true);
            setError(null);
            console.log('Attempting to refund sale:', sale_id); // Add this
            const result = await salesAPI.refundSale(sale_id);
            console.log('Refund successful:', result); // Add this

            setSales(prev => prev.map(sale =>
                sale.sale_id === sale_id
                    ? { ...sale, status: 'refunded' }
                    : sale
            ));

            return result;
        } catch (err) {
            console.error('Refund sale error in hook:', err); // Add this
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return {
        sales,
        loading,
        error,
        pagination,
        fetchSales,
        goToPage,
        createSale,
        voidSale,
        refundSale
    };
};