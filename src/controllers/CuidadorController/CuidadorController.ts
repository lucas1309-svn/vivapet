import { NextResponse } from "next/server";
import { Cuidador } from "@/models/Cuidador/Cuidador";
import { CuidadorRepository } from "@/repositories/CuidadorRepository/CuidadorRepository";

export class CuidadorController {
    private cuidadorRepository: CuidadorRepository;

    constructor() {
        this.cuidadorRepository = new CuidadorRepository();
    }

    public async listar(req: Request) {
        try {
            const cuidadores = await this.cuidadorRepository.listar();
            return NextResponse.json(cuidadores, { status: 200 });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar a lista de cuidadores no servidor.";
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

            // Instancia o modelo Cuidador sem o id_cuidador (gerado via SERIAL pelo banco)
            const novoCuidador = new Cuidador(
                nome,
                cpf,
                email,
                new Date(),
                true
            );

            const cuidadorSalvo = await this.cuidadorRepository.salvar(novoCuidador);

            return NextResponse.json(cuidadorSalvo, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível concluir o cadastro do cuidador devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async buscarPorId(req: Request, params: { id_cuidador: string }) {
        try {
            const id_cuidador = Number(params.id_cuidador);

            if (isNaN(id_cuidador)) {
                return NextResponse.json({ error: "O ID do cuidador fornecido é inválido." }, { status: 400 });
            }

            const cuidador = await this.cuidadorRepository.buscarPorId(id_cuidador);

            if (!cuidador) {
                return NextResponse.json({ error: "Nenhum cuidador foi encontrado com o ID especificado." }, { status: 404 });
            }

            return NextResponse.json(cuidador, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar os dados do cuidador.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async atualizar(req: Request, params: { id_cuidador: string }) {
        try {
            const id_cuidador = Number(params.id_cuidador);
            const body = await req.json();
            const { nome, cpf, email, ativo } = body;

            if (isNaN(id_cuidador)) {
                return NextResponse.json({ error: "O ID do cuidador fornecido é inválido." }, { status: 400 });
            }

            const cuidadorExistente = await this.cuidadorRepository.buscarPorId(id_cuidador);

            if (!cuidadorExistente) {
                return NextResponse.json({ error: "Nenhum cuidador foi encontrado para atualização com o ID informado." }, { status: 404 });
            }

            if (nome !== undefined) cuidadorExistente.nome = nome;
            if (cpf !== undefined) cuidadorExistente.cpf = cpf;
            if (email !== undefined) cuidadorExistente.email = email;
            if (ativo !== undefined) cuidadorExistente.ativo = ativo;

            await this.cuidadorRepository.atualizar(cuidadorExistente);

            return NextResponse.json({ message: "Dados do cuidador atualizados com sucesso." }, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível atualizar os dados do cuidador devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}