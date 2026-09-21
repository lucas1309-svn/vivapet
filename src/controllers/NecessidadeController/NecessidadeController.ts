import { NextResponse } from "next/server";
import { NecessidadeService } from "@/services/NecessidadeService/NecessidadeService";

export class NecessidadeController {
    private necessidadeService: NecessidadeService;

    constructor() {
        this.necessidadeService = new NecessidadeService();
    }

    public async cadastrar(req: Request) {
        try {
            const body = await req.json();
            const { descricao, observacoes, ativa, id_animal } = body;

            if (!descricao || id_animal === undefined) {
                return NextResponse.json(
                    { error: "Os campos 'descricao' e 'id_animal' são obrigatórios." },
                    { status: 400 }
                );
            }

            const novaNecessidade = await this.necessidadeService.cadastrar({
                descricao,
                observacoes,
                ativa: ativa ?? true,
                id_animal: Number(id_animal)
            });

            return NextResponse.json(novaNecessidade, { status: 201 });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro inesperado ao registrar necessidade.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async atualizar(req: Request, params: { id_necessidade: string }) {
        try {
            const id_necessidade = Number(params.id_necessidade);
            if (isNaN(id_necessidade)) {
                return NextResponse.json({ error: "O ID da necessidade é inválido." }, { status: 400 });
            }

            const body = await req.json();
            const { descricao, observacoes, ativa, id_animal } = body;

            if (!descricao || id_animal === undefined) {
                return NextResponse.json(
                    { error: "Os campos 'descricao' e 'id_animal' são obrigatórios para a atualização." },
                    { status: 400 }
                );
            }

            const necessidadeAtualizada = await this.necessidadeService.atualizar(id_necessidade, {
                descricao,
                observacoes,
                ativa: ativa ?? true,
                id_animal: Number(id_animal)
            });

            return NextResponse.json({ message: "Necessidade atualizada com sucesso.", data: necessidadeAtualizada }, { status: 200 });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro inesperado ao atualizar necessidade.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}