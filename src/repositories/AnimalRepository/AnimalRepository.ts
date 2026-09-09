import { db } from "@/config/db";
import { Animal } from "@/models/Animal/Animal";
import { SexoAnimal, StatusAnimal, TipoAnimal } from "@/models/Enums/Enums";

export class AnimalRepository {

    public async salvar(animal: Animal, id_cuidador: number): Promise<Animal> {
        const query = `
            INSERT INTO animal 
            (nome, tipo, raca, sexo, data_nascimento, observacoes, status, data_entrada_abrigo, id_cuidador) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id_animal
        `;

        const values = [
            animal.nome,
            animal.tipo,
            animal.raca,
            animal.sexo,
            animal.data_nascimento,
            animal.observacoes,
            animal.status,
            animal.data_entrada_abrigo,
            id_cuidador
        ];

        const { rows } = await db.query(query, values);

        return new Animal(
            animal.nome,
            animal.tipo,
            animal.raca,
            animal.sexo,
            animal.data_nascimento,
            animal.data_entrada_abrigo,
            animal.observacoes,
            animal.status,
            animal.necessidades, // O array de necessidades atual (geralmente vazio na criação)
            rows[0].id_animal    // ID gerado pelo banco indo para o último parâmetro
        );
    }

    public async buscarPorId(id_animal: number): Promise<Animal | null> {
        const query = `SELECT * FROM animal WHERE id_animal = $1`;
        const { rows } = await db.query(query, [id_animal]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Animal(
            row.nome,
            row.tipo as TipoAnimal,
            row.raca,
            row.sexo as SexoAnimal,
            new Date(row.data_nascimento),
            new Date(row.data_entrada_abrigo),
            row.observacoes,
            row.status as StatusAnimal,
            [], // As necessidades iniciam vazias aqui e devem ser buscadas pelo Service
            row.id_animal
        );
    }

    public async atualizar(animal: Animal, id_cuidador: number): Promise<void> {
        if (!animal.id_animal) {
            throw new Error("Não é possível atualizar um animal que não possui ID.");
        }

        // CORREÇÃO APLICADA: A query original dizia "UPDATE cuidador". Corrigido para "animal".
        const query = `
            UPDATE animal 
            SET nome = $1, tipo = $2, raca = $3, sexo = $4, data_nascimento = $5, observacoes = $6, status = $7, id_cuidador = $8 
            WHERE id_animal = $9
        `;

        const values = [
            animal.nome,
            animal.tipo,
            animal.raca,
            animal.sexo,
            animal.data_nascimento,
            animal.observacoes,
            animal.status,
            id_cuidador,
            animal.id_animal
        ];

        await db.query(query, values);
    }

    // MÉTODO EXTRA: listar todos os animais vinculados a um cuidador específico
    public async listarPorCuidador(id_cuidador: number): Promise<Animal[]> {
        const query = `SELECT * FROM animal WHERE id_cuidador = $1 ORDER BY id_animal`;
        const { rows } = await db.query(query, [id_cuidador]);

        return rows.map(row => new Animal(
            row.nome,
            row.tipo as TipoAnimal,
            row.raca,
            row.sexo as SexoAnimal,
            new Date(row.data_nascimento),
            new Date(row.data_entrada_abrigo),
            row.observacoes,
            row.status as StatusAnimal,
            [], // Necessidades vazias
            row.id_animal
        ));
    }


    // Listar todos os animais do abrigo
    public async listarTodos(): Promise<Animal[]> {
        const query = `SELECT * FROM animal ORDER BY nome`;
        const { rows } = await db.query(query);

        return rows.map(row => new Animal(
            row.nome,
            row.tipo as TipoAnimal,
            row.raca,
            row.sexo as SexoAnimal,
            new Date(row.data_nascimento),
            new Date(row.data_entrada_abrigo),
            row.observacoes,
            row.status as StatusAnimal,
            [], // Necessidades iniciam vazias
            row.id_animal
        ));
    }

}