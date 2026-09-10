import { NextResponse } from "next/server";
import { DoacaoService } from "@/services/DoacaoService/DoacaoService";

export class DoacaoController {
    private doacaoService: DoacaoService;

    constructor() {
        this.doacaoService = new DoacaoService();
    }

    public async cadastrar(req: Request) {
        try {
            const body = await req.json();
            const { id_doador, observacoes, itens } = body;

            // Validações essenciais da requisição
            if (!id_doador) {
                return NextResponse.json(
                    { error: "O campo 'id_doador' é obrigatório para registrar uma doação." },
                    { status: 400 }
                );
            }

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return NextResponse.json(
                    { error: "Uma doação precisa conter uma lista válida com pelo menos um item ('itens')." },
                    { status: 400 }
                );
            }

            // Tratamento e conversão dos itens (tipagem e datas)
            const itensFormatados = itens.map((item: any, index: number) => {
                if (!item.id_suprimento || !item.quantidade || !item.data_validade) {
                    throw new Error(`O item na posição ${index} está com dados incompletos. 'id_suprimento', 'quantidade' e 'data_validade' são obrigatórios.`);
                }

                return {
                    id_suprimento: Number(item.id_suprimento),
                    quantidade: Number(item.quantidade),
                    data_validade: new Date(item.data_validade), // Converte a string ISO do JSON para Date
                    observacoes: item.observacoes || ''
                };
            });

            // Envia para o Service processar a transação (salvar doação, salvar itens e atualizar estoque)
            const doacaoSalva = await this.doacaoService.registrarDoacao({
                id_doador: Number(id_doador),
                observacoes,
                itens: itensFormatados
            });

            return NextResponse.json(doacaoSalva, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível registrar a doação e seus itens devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async buscarCompleto(req: Request, params: { id_doacao: string }) {
        try {
            const id_doacao = Number(params.id_doacao);

            if (isNaN(id_doacao)) {
                return NextResponse.json({ error: "O ID da doação fornecido é inválido." }, { status: 400 });
            }

            // O Service já cuida da Composição (buscar a doação e acoplar os itens nela)
            const doacao = await this.doacaoService.buscarDoacaoCompleta(id_doacao);

            if (!doacao) {
                return NextResponse.json({ error: "Nenhuma doação foi encontrada com o ID especificado." }, { status: 404 });
            }

            return NextResponse.json(doacao, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar os dados completos da doação.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }
}