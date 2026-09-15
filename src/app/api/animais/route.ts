import { AnimalController } from "@/controllers/AnimalController/AnimalController";

const animalController = new AnimalController();

export async function GET(req: Request) {
    return animalController.listarTodos(req);
}

export async function POST(req: Request) {
    return animalController.cadastrar(req);
}