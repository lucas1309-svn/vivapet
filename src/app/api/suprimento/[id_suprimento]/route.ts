import { SuprimentoController } from "@/controllers/SuprimentoController/SuprimentoController";

const suprimentoController = new SuprimentoController

export async function GET(req: Request, {params}: {params: Promise <{id_suprimento: string}>}){
    const resolvedParams = await params

    return suprimentoController.buscarPorId(req, resolvedParams)
}

export async function PUT(req: Request, {params}: {params: Promise <{id_suprimento: string}>}){
    const resolvedParams = await params

    return suprimentoController.atualizar(req, resolvedParams)
}