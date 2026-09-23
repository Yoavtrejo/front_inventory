import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {API, TOKEN_KEYS} from "@/constants";

const api = axios.create({
    baseURL: API,
    timeout: 13000,
});

function redirectToLogin() {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    window.location.href = "/login";
}

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
            try {
                const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh);

                if (!refreshToken) {
                    throw new Error("No hay token de actualización disponible");
                }

                // Se usa axios directo para que el interceptor no reintente el refresh en bucle
                const response = await axios.post<{ access: string }>(`${API}/token/refresh/`, { refresh: refreshToken });
                const newAccessToken = response.data.access;

                localStorage.setItem(TOKEN_KEYS.access, newAccessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                redirectToLogin();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default api;
