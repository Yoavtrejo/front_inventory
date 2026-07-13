export type MaterialStatus =  'Disponible' | 'Stock bajo' | 'Agotado' | 'No disponible' | 'Dañado' | 'En reparación' | 'En préstamo';


export interface Material {
    id: number,
    name: string,
    description: string;
    quantity: number;
    min_stock: number;
    max_stock: number;
    status: MaterialStatus;
    created_at:string;
    update_at:string;
}

export interface CreateMaterialPayload{
    name: string;
    description: string;
    quantity: number;
    min_stock: number;
    max_stock: number;
    status: MaterialStatus;
}

export interface UpdateMaterialPayload{
    name?: string;
    description?: string;
    quantity?: number;
    min_stock?: number;
    max_stock?: number;
    status: MaterialStatus;
}