import { CuidadorController } from "@/controllers/CuidadorController/CuidadorController";

const cuidadorController = new CuidadorController();

export async function GET(req: Request){
    return cuidadorController.listar(req); 
}

export async function POST(req: Request){
    return cuidadorController.cadastrar(req)
}