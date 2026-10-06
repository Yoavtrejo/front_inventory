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

// Cuerpo de error del backend: envuelto ({message}), {detail} o el formato de DRF por campo
// ({"non_field_errors": ["..."]} / {"grupo": ["..."]}) en vistas sin envoltura
export function errorBodyMessage(body: unknown, fallback: string): string {
    if (typeof body !== 'object' || body === null) return fallback;
    const record = body as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.detail === 'string') return record.detail;
    for (const [field, value] of Object.entries(record)) {
        const firstMessage = Array.isArray(value) ? value[0] : value;
        if (typeof firstMessage === 'string') {
            return field === 'non_field_errors' ? firstMessage : `${field}: ${firstMessage}`;
        }
    }
    return fallback;
}
