import axios from 'axios';

const API_URL = 'http://localhost:3000/user/auth';

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Registration Error';
    }
};

const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Login Error';
    }
};

const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Logout Error';
    }
};

const loggedUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/logged`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error Active';
    }
};

export { registerUser, loginUser, logoutUser, loggedUser };