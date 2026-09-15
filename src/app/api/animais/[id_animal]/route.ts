import { AnimalController } from "@/controllers/AnimalController/AnimalController";

const animalController = new AnimalController();

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id_animal: string }> }
) {
    const resolvedParams = await params;
    // Traz os dados do animal acoplados com suas Necessidades (Composição)
    return animalController.buscarCompleto(req, resolvedParams);
}

// Utilizando PATCH pois a ação altera apenas o status e exige o id_cuidador no body
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id_animal: string }> }
) {
    const resolvedParams = await params;
    return animalController.atualizarStatus(req, resolvedParams);
}