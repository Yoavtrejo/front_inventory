export interface Recurso {
    id: number;
    title: string;
    description: string;
    file: string | null;
    created_at: string;
}

export interface CreateRecursoPayload {
    title: string;
    description: string;
    file: File | null;
}
