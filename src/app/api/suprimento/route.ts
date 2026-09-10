import { SuprimentoController } from "@/controllers/SuprimentoController/SuprimentoController";

const suprimentoController = new SuprimentoController

export async function GET(req: Request){
    return suprimentoController.listar(req)
}

export async function POST(req: Request){
    return suprimentoController.cadastrar(req)
}