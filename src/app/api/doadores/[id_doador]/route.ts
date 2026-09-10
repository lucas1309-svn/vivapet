import { DoadorController } from "@/controllers/DoadorController/DoadorController";
import { promises } from "dns";

const doadorController = new DoadorController

export async function GET(req: Request, {params}: {params: Promise<{id_doador: string}>}){

    const resolvedParams = await params

    return doadorController.buscarPorId(req, resolvedParams)
}

export async function PUT(req: Request, {params}: {params: Promise<{id_doador: string}>}){

    const resolvedParams = await params

    return doadorController.atualizar(req, resolvedParams)
}