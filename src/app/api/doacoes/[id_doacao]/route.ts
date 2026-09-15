import { DoacaoController } from "@/controllers/DoacaoController/DoacaoController";

const doacaoController = new DoacaoController();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id_doacao: string }> }
) {
    const resolvedParams = await params;
    // Traz a doação acoplada com a lista de itens (Composição)
    return doacaoController.buscarCompleto(req, resolvedParams);
}