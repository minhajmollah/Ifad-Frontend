import axios from 'axios'
import {logout, token} from "./auth";
import {API_URL} from "./constants";

const axiosClient = axios.create({
    baseURL: API_URL
})

setTimeout(() => {
    axiosClient.defaults.headers.common['Authorization'] = token();
});

axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const status = error?.response?.status;

    if (status && [401].includes(status)) {
        logout();
    } else if (status && [403].includes(status)) {
        location.href = '/auth/verify-email';
    } else {
        return Promise.reject(error);
    }
})

export default axiosClient;