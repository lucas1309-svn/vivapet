import { RegistroUsoController } from "@/controllers/RegistroUsoController/RegistroUsoController";

const registroUsoController = new RegistroUsoController();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id_animal: string }> }
) {
    const resolvedParams = await params;
    return registroUsoController.listarPorAnimal(req, resolvedParams);
}