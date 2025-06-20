import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5555',
});

export const getTools = async () => {
  try {
    const response = await api.get('/tools');
    return response.data;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
};

export default api;