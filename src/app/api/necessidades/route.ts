import { NecessidadeController } from "@/controllers/NecessidadeController/NecessidadeController";

const necessidadeController = new NecessidadeController();

// POST: Cria uma nova necessidade
export async function POST(req: Request) {
    return necessidadeController.cadastrar(req);
}