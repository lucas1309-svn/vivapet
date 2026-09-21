import { NecessidadeController } from "@/controllers/NecessidadeController/NecessidadeController";

const necessidadeController = new NecessidadeController();

// PUT: Atualiza uma necessidade existente
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id_necessidade: string }> }
) {
    const resolvedParams = await params;
    return necessidadeController.atualizar(req, resolvedParams);
}