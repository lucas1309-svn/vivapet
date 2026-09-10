import { NextResponse } from "next/server";
import { Doador } from "@/models/Doador/Doador";
import { DoadorRepository } from "@/repositories/DoadorRepository/DoadorRepository";

export class DoadorController {
    private doadorRepository: DoadorRepository;

    constructor() {
        this.doadorRepository = new DoadorRepository();
    }

    public async listarTodos(req: Request) {
        try {
            const doadores = await this.doadorRepository.listarTodos();
            return NextResponse.json(doadores, { status: 200 });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar a lista de doadores no servidor.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async cadastrar(req: Request) {
        try {
            const body = await req.json();
            const { nome, cpf, email } = body;

            if (!nome || !cpf || !email) {
                return NextResponse.json(
                    { error: "Os campos 'nome', 'cpf' e 'email' são obrigatórios para o cadastro." },
                    { status: 400 }
                );
            }

            // Instancia o modelo Doador sem o id_doador (que será gerado via SERIAL)
            const novoDoador = new Doador(
                nome,
                cpf,
                email
            );

            const doadorSalvo = await this.doadorRepository.salvar(novoDoador);

            return NextResponse.json(doadorSalvo, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível concluir o cadastro do doador devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async buscarPorId(req: Request, params: { id_doador: string }) {
        try {
            const id_doador = Number(params.id_doador);

            if (isNaN(id_doador)) {
                return NextResponse.json({ error: "O ID do doador fornecido é inválido." }, { status: 400 });
            }

            const doador = await this.doadorRepository.buscarPorId(id_doador);

            if (!doador) {
                return NextResponse.json({ error: "Nenhum doador foi encontrado com o ID especificado." }, { status: 404 });
            }

            return NextResponse.json(doador, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar os dados do doador.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async atualizar(req: Request, params: { id_doador: string }) {
        try {
            const id_doador = Number(params.id_doador);
            const body = await req.json();
            const { nome, cpf, email } = body;

            if (isNaN(id_doador)) {
                return NextResponse.json({ error: "O ID do doador fornecido é inválido." }, { status: 400 });
            }

            const doadorExistente = await this.doadorRepository.buscarPorId(id_doador);

            if (!doadorExistente) {
                return NextResponse.json({ error: "Nenhum doador foi encontrado para atualização com o ID informado." }, { status: 404 });
            }

            if (nome !== undefined) doadorExistente.nome = nome;
            if (cpf !== undefined) doadorExistente.cpf = cpf;
            if (email !== undefined) doadorExistente.email = email;

            await this.doadorRepository.atualizar(doadorExistente);

            return NextResponse.json({ message: "Dados do doador atualizados com sucesso." }, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível atualizar os dados do doador devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}