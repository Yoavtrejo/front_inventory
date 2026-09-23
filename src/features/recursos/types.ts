export interface Recurso {
    id: number;
    title: string;
    description: string;
    file: string | null;
    created_by: number;
    created_by_name: string;
    created_at: string;
}

export interface CreateRecursoPayload {
    title: string;
    description: string;
    file: File | null;
}
