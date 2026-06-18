import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {API} from "@/constants";

const api = axios.create({
    baseURL: API,
    timeout: 13000,
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Obtenemos el token solo en el cliente
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('token');   
        
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
        
        if (error.response?.status === 401 && !originalRequest?._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
                
                if (!refreshToken) {
                    throw new Error("No hay token de actualización disponible");
                }

                const response = await api.post("refresh/", { refresh: refreshToken });
                const newAccessToken = response.data.access;
                
                if (newAccessToken && originalRequest) {
                    localStorage.setItem("token", newAccessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
                
                throw new Error("No se recibió token de acceso");

            } catch (refreshError) {
                console.error("Error al refrescar el token:", refreshError);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);


export default api;