import { AlertaEstoqueController } from "@/controllers/AlertaEstoqueController/AlertaEstoqueController";

const alertaEstoqueController = new AlertaEstoqueController();

export async function GET(req: Request) {
    // Retorna por padrão apenas os alertas com status 'ATIVO'
    return alertaEstoqueController.listarAtivos(req);
}

export async function POST(req: Request) {
    return alertaEstoqueController.cadastrar(req);
}