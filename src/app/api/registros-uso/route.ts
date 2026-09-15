import { RegistroUsoController } from "@/controllers/RegistroUsoController/RegistroUsoController";

const registroUsoController = new RegistroUsoController();

export async function POST(req: Request) {
    return registroUsoController.cadastrar(req);
}