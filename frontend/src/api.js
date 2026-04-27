import axios from 'axios';

// CHANGE THIS TO YOUR DEPLOYED BACKEND URL AFTER DEPLOYMENT
// For local testing:
const API_URL = 'https://item-manager-backend-production-2eee.up.railway.app/api/items';

// For production (uncomment after backend deployment):
// const API_URL = 'https://your-backend.onrender.com/api/items';

export const getItems = () => axios.get(API_URL);
export const getItem = (id) => axios.get(`${API_URL}/${id}`);
export const createItem = (item) => axios.post(API_URL, item);
export const updateItem = (id, item) => axios.put(`${API_URL}/${id}`, item);
export const deleteItem = (id) => axios.delete(`${API_URL}/${id}`);