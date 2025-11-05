import { useState, useEffect } from 'react';

export const useCategories = () => {
    const [categories, setCategories] = useState(["all"]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const categoriesData = await response.json();
                const categoryNames = categoriesData.map(cat => cat.name);
                setCategories(["all", ...categoryNames]);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching categories:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};