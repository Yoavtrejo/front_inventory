import { inventarioService } from '@/features/inventario';
import type { Material, MaterialStatus } from '@/features/inventario/types';

// El backend solo acepta: Disponible, No disponible, Danado, En reparación, En préstamo
function nextStatusFor(material: Material, nextQuantity: number): MaterialStatus {
    if (nextQuantity <= 0) return 'No disponible';
    if (material.status === 'No disponible') return 'Disponible';
    return material.status;
}

export async function adjustMaterialStock(materialId: number, delta: number): Promise<Material> {
    const material = await inventarioService.getById(materialId);
    const nextQuantity = Math.max(0, material.quantity + delta);
    const nextStatus = nextStatusFor(material, nextQuantity);

    await inventarioService.update(materialId, {
        name: material.name,
        description: material.description,
        quantity: nextQuantity,
        min_stock: material.min_stock,
        max_stock: material.max_stock,
        status: nextStatus,
    });

    return { ...material, quantity: nextQuantity, status: nextStatus };
}
