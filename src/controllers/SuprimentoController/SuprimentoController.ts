import { NextResponse } from "next/server";
import { SuprimentoService } from "@/services/SuprimentoService/SuprimentoService";

export class SuprimentoController {
    private suprimentoService: SuprimentoService;

    constructor() {
        this.suprimentoService = new SuprimentoService();
    }

    public async listar(req: Request) {
        try {
            const suprimentos = await this.suprimentoService.listar();
            return NextResponse.json(suprimentos, { status: 200 });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar o catálogo de suprimentos no servidor.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async cadastrar(req: Request) {
        try {
            const body = await req.json();

            // O frontend pode enviar em snake_case (padrão do banco) ou camelCase. 
            // Vamos desestruturar mapeando para os nomes corretos.
            const {
                nome,
                unidade,
                quantidade_estoque, quantidadeEstoque, // aceita ambos
                quantidade_minima, quantidadeMinima    // aceita ambos
            } = body;

            const estoque = quantidade_estoque ?? quantidadeEstoque;
            const minima = quantidade_minima ?? quantidadeMinima;

            if (!nome || !unidade || estoque === undefined || minima === undefined) {
                return NextResponse.json(
                    { error: "Os campos 'nome', 'unidade', 'quantidade_estoque' e 'quantidade_minima' são obrigatórios para o cadastro de um suprimento." },
                    { status: 400 }
                );
            }

            const suprimentoSalvo = await this.suprimentoService.cadastrarSuprimento({
                nome,
                unidade,
                quantidadeEstoque: Number(estoque),
                quantidadeMinima: Number(minima)
            });

            return NextResponse.json(suprimentoSalvo, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível concluir o cadastro do suprimento devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async buscarPorId(req: Request, params: { id_suprimento: string }) {
        try {
            const id_suprimento = Number(params.id_suprimento);

            if (isNaN(id_suprimento)) {
                return NextResponse.json({ error: "O ID do suprimento fornecido é inválido." }, { status: 400 });
            }

            const suprimento = await this.suprimentoService.buscarPorId(id_suprimento);

            if (!suprimento) {
                return NextResponse.json({ error: "Nenhum suprimento foi encontrado com o ID especificado." }, { status: 404 });
            }

            return NextResponse.json(suprimento, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar os dados do suprimento.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async atualizar(req: Request, params: { id_suprimento: string }) {
        try {
            const id_suprimento = Number(params.id_suprimento);

            if (isNaN(id_suprimento)) {
                return NextResponse.json({ error: "O ID do suprimento fornecido é inválido." }, { status: 400 });
            }

            const body = await req.json();
            const {
                nome,
                unidade,
                quantidade_minima, quantidadeMinima,
                ativo
            } = body;

            const minima = quantidade_minima ?? quantidadeMinima;

            if (!nome || !unidade || minima === undefined || ativo === undefined) {
                return NextResponse.json(
                    { error: "Os campos 'nome', 'unidade', 'quantidade_minima' e 'ativo' são obrigatórios para atualizar os dados cadastrais." },
                    { status: 400 }
                );
            }

            // Chama o método do Service focado apenas na atualização de dados cadastrais
            await this.suprimentoService.atualizarDadosCadastrais(
                id_suprimento,
                {
                    nome,
                    unidade,
                    quantidade_minima: Number(minima),
                    ativo: Boolean(ativo)
                }
            );

            return NextResponse.json({ message: "Dados cadastrais do suprimento atualizados com sucesso." }, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível atualizar os dados do suprimento devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}