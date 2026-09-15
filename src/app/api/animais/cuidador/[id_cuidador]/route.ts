import { AnimalController } from "@/controllers/AnimalController/AnimalController";

const animalController = new AnimalController();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id_cuidador: string }> }
) {
    const resolvedParams = await params;
    return animalController.listarPorCuidador(req, resolvedParams);
}