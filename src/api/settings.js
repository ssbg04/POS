// const API_URL = 'http://localhost:3001/api/settings';
const API_URL = 'http://192.168.0.104:3001/api/settings';

// api/settings.js
export const settingsAPI = {
    async getSettings() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }
            const data = await response.json();

            // Return the first object instead of the array
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async updateSettings(newSettings) {
        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSettings)
            });
            if (!response.ok) {
                throw new Error('Failed to update settings');
            }
            const data = await response.json();

            // Return the first object instead of the array
            return Array.isArray(data) ? data[0] : data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};