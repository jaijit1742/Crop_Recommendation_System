import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const predictionApi = {
  async predict(formData) {
    const response = await axios.post(`${API_URL}/predict`, formData);
    return response.data;
  },
};
