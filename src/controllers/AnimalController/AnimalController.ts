import { NextResponse } from "next/server";
import { AnimalService } from "@/services/AnimalService/AnimalService";
import { StatusAnimal, TipoAnimal, SexoAnimal } from "@/models/Enums/Enums";

export class AnimalController {
    private animalService: AnimalService;

    constructor() {
        this.animalService = new AnimalService();
    }

    public async listarTodos(req: Request) {
        try {
            const animais = await this.animalService.listarTodos();
            return NextResponse.json(animais, { status: 200 });
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar a lista de animais no servidor.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async listarPorCuidador(req: Request, params: { id_cuidador: string }) {
        try {
            const id_cuidador = Number(params.id_cuidador);

            if (isNaN(id_cuidador)) {
                return NextResponse.json({ error: "O ID do cuidador fornecido é inválido." }, { status: 400 });
            }

            const animais = await this.animalService.listarPorCuidador(id_cuidador);

            return NextResponse.json(animais, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao listar os animais vinculados a este cuidador.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async buscarCompleto(req: Request, params: { id_animal: string }) {
        try {
            const id_animal = Number(params.id_animal);

            if (isNaN(id_animal)) {
                return NextResponse.json({ error: "O ID do animal fornecido é inválido." }, { status: 400 });
            }

            const animal = await this.animalService.buscarAnimalCompleto(id_animal);

            if (!animal) {
                return NextResponse.json({ error: "Nenhum animal foi encontrado com o ID especificado." }, { status: 404 });
            }

            return NextResponse.json(animal, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Erro interno ao buscar os dados completos do animal.";
            return NextResponse.json({ error: message }, { status: 500 });
        }
    }

    public async cadastrar(req: Request) {
        try {
            const body = await req.json();
            const {
                nome, tipo, raca, sexo, data_nascimento,
                data_entrada_abrigo, observacoes, id_cuidador
            } = body;

            // Validação básica dos dados obrigatórios na camada de requisição
            if (!nome || !tipo || !raca || !sexo || !data_nascimento || !data_entrada_abrigo || !id_cuidador) {
                return NextResponse.json(
                    { error: "Todos os campos obrigatórios (nome, tipo, raca, sexo, data_nascimento, data_entrada_abrigo, id_cuidador) devem ser informados." },
                    { status: 400 }
                );
            }

            // Repassa para o Service processar a Regra de Negócio e o Repositório persistir
            const animalSalvo = await this.animalService.cadastrarAnimal({
                nome,
                tipo: tipo as TipoAnimal,
                raca,
                sexo: sexo as SexoAnimal,
                data_nascimento: new Date(data_nascimento),
                data_entrada_abrigo: new Date(data_entrada_abrigo),
                observacoes
            }, Number(id_cuidador));

            return NextResponse.json(animalSalvo, { status: 201 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível concluir o cadastro do animal devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }

    public async atualizarStatus(req: Request, params: { id_animal: string }) {
        try {
            const id_animal = Number(params.id_animal);
            const body = await req.json();
            const { status, id_cuidador } = body;

            if (isNaN(id_animal)) {
                return NextResponse.json({ error: "O ID do animal fornecido é inválido." }, { status: 400 });
            }

            if (!status || !id_cuidador) {
                return NextResponse.json({ error: "Os campos 'status' e 'id_cuidador' são obrigatórios para esta operação." }, { status: 400 });
            }

            await this.animalService.atualizarStatus(
                id_animal,
                status as StatusAnimal,
                Number(id_cuidador)
            );

            return NextResponse.json({ message: "Status do animal atualizado com sucesso." }, { status: 200 });

        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : "Não foi possível atualizar o status do animal devido a um erro inesperado.";
            return NextResponse.json({ error: message }, { status: 400 });
        }
    }
}