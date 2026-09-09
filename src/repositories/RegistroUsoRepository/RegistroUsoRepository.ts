import { db } from "@/config/db";
import { RegistroUso } from "@/models/RegistroUso/RegistroUso";

export class RegistroUsoRepository {

    public async salvar(registro: RegistroUso): Promise<RegistroUso> {
        const query = `
            INSERT INTO registro_uso (data_uso, quantidade_usada, observacoes, id_animal, id_suprimento, id_cuidador)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_registro_uso
        `;

        const values = [
            registro.data_uso,
            registro.quantidade_usada,
            registro.observacoes,
            registro.id_animal,
            registro.id_suprimento,
            registro.id_cuidador
        ];

        const { rows } = await db.query(query, values);

        return new RegistroUso(
            registro.data_uso,
            registro.quantidade_usada,
            registro.id_cuidador,
            registro.id_animal,
            registro.id_suprimento,
            registro.observacoes,
            rows[0].id_registro_uso // ID gerado pelo banco recebendo o último slot
        );
    }

    public async buscarPorId(id_registro_uso: number): Promise<RegistroUso | null> {
        const query = `SELECT * FROM registro_uso WHERE id_registro_uso = $1`;
        const { rows } = await db.query(query, [id_registro_uso]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Ordem respeitando o construtor: data_uso, quantidade_usada, id_cuidador, id_animal, id_suprimento, observacoes, id_registro_uso
        return new RegistroUso(
            new Date(row.data_uso),
            row.quantidade_usada,
            row.id_cuidador,
            row.id_animal,
            row.id_suprimento,
            row.observacoes,
            row.id_registro_uso
        );
    }

    // LISTAR TODO HISTÓRICO DE CONSUMO DE UM ANIMAL ESPECÍFICO:
    public async buscarPorAnimal(id_animal: number): Promise<RegistroUso[]> {
        const query = `SELECT * FROM registro_uso WHERE id_animal = $1 ORDER BY data_uso DESC`;
        const { rows } = await db.query(query, [id_animal]);

        return rows.map(row => new RegistroUso(
            new Date(row.data_uso),
            row.quantidade_usada,
            row.id_cuidador,
            row.id_animal,
            row.id_suprimento,
            row.observacoes,
            row.id_registro_uso
        ));
    }

    // LISTAR TODO HISTÓRICO DE CONSUMO DE UM SUPRIMENTO ESPECÍFICO:
    public async buscarPorSuprimento(id_suprimento: number): Promise<RegistroUso[]> {
        const query = `SELECT * FROM registro_uso WHERE id_suprimento = $1 ORDER BY data_uso DESC`;
        const { rows } = await db.query(query, [id_suprimento]);

        return rows.map(row => new RegistroUso(
            new Date(row.data_uso),
            row.quantidade_usada,
            row.id_cuidador,
            row.id_animal,
            row.id_suprimento,
            row.observacoes,
            row.id_registro_uso
        ));
    }
}