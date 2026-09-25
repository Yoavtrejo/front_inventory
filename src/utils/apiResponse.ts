interface WrappedResponse<T> {
    success: boolean;
    data: T
}

function isWrapped<T>(response: unknown) : response is WrappedResponse<T>{
    return (
        typeof response === 'object' && response !== null && 'success' in response && 'data' in response
    );
}

export function unwrapResponse<T>(raw: unknown) : T {
    if (isWrapped<T>(raw)) return raw.data;
    return raw as T;
}

export function unwrapList<T>(raw: unknown) : T[] {
    const unwrapped = unwrapResponse<T[] | unknown> (raw);
    return Array.isArray(unwrapped) ? unwrapped : []
}

interface ApiErrorBody {
    message?: string;
    detail?: string;
}

// El backend responde { success:false, message } (o { detail } en vistas sin envoltura)
export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const body = (error as { response?: { data?: ApiErrorBody } }).response?.data;
        if (body?.message) return body.message;
        if (body?.detail) return body.detail;
    }
    return fallback;
}
