import { API, TOKEN_KEYS } from "@/constants";

// El backend rota el refresh en cada uso y pone el anterior en lista negra:
// varias peticiones con 401 simultáneo deben compartir UN solo refresh.
let refreshInFlight: Promise<string> | null = null;

async function requestNewTokens(): Promise<string> {
    const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh);
    if (!refreshToken) throw new Error("No hay token de actualización disponible");

    const response = await fetch(`${API}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) throw new Error("No se pudo renovar la sesión");

    const tokens = await response.json() as { access: string; refresh?: string };
    localStorage.setItem(TOKEN_KEYS.access, tokens.access);
    if (tokens.refresh) localStorage.setItem(TOKEN_KEYS.refresh, tokens.refresh);
    return tokens.access;
}

export function refreshAccessToken(): Promise<string> {
    if (!refreshInFlight) {
        refreshInFlight = requestNewTokens().finally(() => { refreshInFlight = null; });
    }
    return refreshInFlight;
}

// Si otra petición ya renovó el token mientras esta esperaba, basta con reintentar con el nuevo
export function getFreshAccessToken(tokenUsed: string | null): Promise<string> {
    const currentToken = localStorage.getItem(TOKEN_KEYS.access);
    if (currentToken && currentToken !== tokenUsed) return Promise.resolve(currentToken);
    return refreshAccessToken();
}

export function endSession(): void {
    Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
    window.location.href = "/login";
}

function withAuthorization(init: RequestInit, token: string | null): RequestInit {
    const headers = new Headers(init.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    else headers.delete("Authorization");
    return { ...init, headers };
}

// fetch con token y un reintento tras renovar la sesión; si no se puede renovar, vuelve al login
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
    const tokenUsed = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEYS.access) : null;
    const response = await fetch(input, withAuthorization(init, tokenUsed));
    if (response.status !== 401 || typeof window === "undefined") return response;

    try {
        const freshToken = await getFreshAccessToken(tokenUsed);
        return await fetch(input, withAuthorization(init, freshToken));
    } catch {
        endSession();
        return response;
    }
}
