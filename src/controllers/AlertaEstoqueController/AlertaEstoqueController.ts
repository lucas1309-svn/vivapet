import { NextResponse } from "next/server";
import { AlertaEstoque } from "@/models/AlertaEstoque/AlertaEstoque";
import { AlertaEstoqueRepository } from "@/repositories/AlertaEstoqueRepository/AlertaEstoqueRepository";
import { StatusAlerta } from "@/models/Enums/Enums";

export class AlertaEstoqueController {
    private alertaEstoqueRepository: AlertaEstoqueRepository;

    constructor() {
        this.alertaEstoqueRepository = new AlertaEstoqueRepository();
    }

    // Ideal para alimentar painéis administrativos e dashboards
    public async listarAtivos(req: Request) {
        try {
            const alertas = await this.alertaEstoqueRepository.listarAtivos();
            return NextResponse.json(alertas, { status: 200 });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar a lista de alertas ativos no servidor.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async buscarPorId(req: Request, params: { id_alerta_estoque: string }) {
        try {
            const id_alerta = Number(params.id_alerta_estoque);

            if (isNaN(id_alerta)) {
                return NextResponse.json({ error: "O ID do alerta fornecido é inválido." }, { status: 400 });
            }

            const alerta = await this.alertaEstoqueRepository.buscarPorId(id_alerta);

            if (!alerta) {
                return NextResponse.json({ error: "Nenhum alerta foi encontrado com o ID especificado." }, { status: 404 });
            }

            return NextResponse.json(alerta, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar os detalhes do alerta de estoque.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    // Cadastro manual de alerta (caso um administrador queira criar um aviso pontual para um suprimento)
    public async cadastrar(req: Request) {
        try {
            const body = await req.json();
            const { mensagem, id_suprimento } = body;

            if (!mensagem || !id_suprimento) {
                return NextResponse.json(
                    { error: "Os campos 'mensagem' e 'id_suprimento' são obrigatórios para registrar um alerta." },
                    { status: 400 }
                );
            }

            const novoAlerta = new AlertaEstoque(
                new Date(),
                mensagem,
                Number(id_suprimento),
                StatusAlerta.ATIVO
            );

            const alertaSalvo = await this.alertaEstoqueRepository.salvar(novoAlerta);

            return NextResponse.json(alertaSalvo, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível registrar o alerta de estoque devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    // Rota específica para a equipe dar baixa no alerta após a reposição
    public async resolver(req: Request, params: { id_alerta_estoque: string }) {
        try {
            const id_alerta = Number(params.id_alerta_estoque);

            if (isNaN(id_alerta)) {
                return NextResponse.json({ error: "O ID do alerta fornecido é inválido." }, { status: 400 });
            }

            const alerta = await this.alertaEstoqueRepository.buscarPorId(id_alerta);

            if (!alerta) {
                return NextResponse.json({ error: "Nenhum alerta foi encontrado com o ID informado." }, { status: 404 });
            }

            if (alerta.status === StatusAlerta.RESOLVIDO) {
                return NextResponse.json({ error: "Este alerta já se encontra resolvido." }, { status: 400 });
            }

            // Aplica a regra de negócio da Entidade
            alerta.marcarComoResolvido();

            // Persiste a mudança
            await this.alertaEstoqueRepository.atualizar(alerta);

            return NextResponse.json({ message: "Alerta marcado como resolvido com sucesso." }, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível marcar o alerta como resolvido devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}