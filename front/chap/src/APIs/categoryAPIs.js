// ../APIs/categoryAPIs.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/categories/auth/categories';

const AllCategory = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('AllCategory response:', response.data); // Debug
        return response.data;
    } catch (error) {
        console.error('Error fetching all categories:', error.message);
        throw new Error('Failed to fetch categories');
    }
};

const OneCategory = async ({ category_id }) => {
    try {
        if (!category_id || isNaN(category_id)) {
            throw new Error('Invalid category ID');
        }
        const response = await axios.get(`${API_URL}/${category_id}`);
        console.log('OneCategory response:', response.data); // Debug
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error.message);
        throw new Error('Failed to fetch category');
    }
};

export { AllCategory, OneCategory };