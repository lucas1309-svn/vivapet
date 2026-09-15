import { AlertaEstoqueController } from "@/controllers/AlertaEstoqueController/AlertaEstoqueController";

const alertaEstoqueController = new AlertaEstoqueController();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id_alerta_estoque: string }> }
) {
    const resolvedParams = await params;
    return alertaEstoqueController.buscarPorId(req, resolvedParams);
}

// Utilizando PATCH pois a ação altera especificamente o status do alerta
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id_alerta_estoque: string }> }
) {
    const resolvedParams = await params;
    return alertaEstoqueController.resolver(req, resolvedParams);
}