import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {API, TOKEN_KEYS} from "@/constants";
import { endSession, getFreshAccessToken } from "./authSession";

const api = axios.create({
    baseURL: API,
    timeout: 13000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Obtenemos el token solo en el cliente
        if (typeof window !== "undefined") {
            const token = localStorage.getItem(TOKEN_KEYS.access);

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && typeof window !== "undefined") {
            originalRequest._retry = true;
            const authorization = originalRequest.headers['Authorization'];
            const tokenUsed = typeof authorization === 'string' ? authorization.replace('Bearer ', '') : null;
            try {
                const freshToken = await getFreshAccessToken(tokenUsed);
                originalRequest.headers['Authorization'] = `Bearer ${freshToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                endSession();
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);


export default api;
