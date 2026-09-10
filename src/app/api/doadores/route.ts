import { DoadorController } from "@/controllers/DoadorController/DoadorController"


const doadorController = new DoadorController

export async function GET(req: Request){
    return doadorController.listarTodos(req);
}

export async function POST(req: Request){
    return doadorController.cadastrar(req)
}