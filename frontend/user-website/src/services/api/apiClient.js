import axios from 'axios';
import config from '../../config';

const apiClient = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
