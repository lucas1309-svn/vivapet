import { NextResponse } from "next/server";
import { RegistroUsoService } from "@/services/RegistroUsoService/RegistroUsoService";

export class RegistroUsoController {
    private registroUsoService: RegistroUsoService;

    constructor() {
        this.registroUsoService = new RegistroUsoService();
    }

    public async cadastrar(req: Request) {
        try {
            const body = await req.json();
            const {
                quantidade_usada,
                observacoes,
                id_cuidador,
                id_animal,
                id_suprimento
            } = body;

            // Validação dos dados obrigatórios na entrada da requisição
            if (quantidade_usada === undefined || !id_cuidador || !id_animal || !id_suprimento) {
                return NextResponse.json(
                    { error: "Os campos 'quantidade_usada', 'id_cuidador', 'id_animal' e 'id_suprimento' são obrigatórios para registrar o consumo." },
                    { status: 400 }
                );
            }

            // O Service processa o abatimento do estoque e a possível geração de alertas
            const registroSalvo = await this.registroUsoService.registrarConsumo({
                quantidade_usada: Number(quantidade_usada),
                observacoes,
                id_cuidador: Number(id_cuidador),
                id_animal: Number(id_animal),
                id_suprimento: Number(id_suprimento)
            });

            return NextResponse.json(registroSalvo, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível registrar o uso do suprimento devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async listarPorAnimal(req: Request, params: { id_animal: string }) {
        try {
            const id_animal = Number(params.id_animal);

            if (isNaN(id_animal)) {
                return NextResponse.json({ error: "O ID do animal fornecido é inválido." }, { status: 400 });
            }

            const historico = await this.registroUsoService.listarHistoricoPorAnimal(id_animal);

            return NextResponse.json(historico, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar o histórico de consumo deste animal.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async listarPorSuprimento(req: Request, params: { id_suprimento: string }) {
        try {
            const id_suprimento = Number(params.id_suprimento);

            if (isNaN(id_suprimento)) {
                return NextResponse.json({ error: "O ID do suprimento fornecido é inválido." }, { status: 400 });
            }

            const historico = await this.registroUsoService.listarHistoricoPorSuprimento(id_suprimento);

            return NextResponse.json(historico, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar o histórico de uso deste suprimento.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }
}