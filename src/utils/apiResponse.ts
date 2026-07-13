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