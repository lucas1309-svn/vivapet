import { db } from "@/config/db";
import { Doador } from "@/models/Doador/Doador";


export class DoadorRepository {

    public async salvar(doador: Doador): Promise<Doador> {
        const query = `
            INSERT INTO doador (nome, cpf, email) 
            VALUES ($1, $2, $3)
            RETURNING id_doador
        `;

        const values = [
            doador.nome,
            doador.cpf,
            doador.email
        ];

        const { rows } = await db.query(query, values);

        return new Doador(
            doador.nome,
            doador.cpf,
            doador.email,
            rows[0].id_doador // ID gerado recebendo o último slot
        );
    }

    public async buscarPorId(id_doador: number): Promise<Doador | null> {
        const query = `SELECT * FROM doador WHERE id_doador = $1`;

        const { rows } = await db.query(query, [id_doador]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Ordem respeitando o construtor: nome, cpf, email, id_doador
        return new Doador(
            row.nome,
            row.cpf,
            row.email,
            row.id_doador
        );
    }

    public async atualizar(doador: Doador): Promise<void> {
        // Trava de segurança para impedir updates acidentais em massa
        if (!doador.id_doador) {
            throw new Error("Não é possível atualizar um doador que não possui ID.");
        }

        const query = `UPDATE doador SET nome = $1, cpf = $2, email = $3 WHERE id_doador = $4`;

        const values = [
            doador.nome,
            doador.cpf,
            doador.email,
            doador.id_doador
        ];

        await db.query(query, values);
    }

    public async listarTodos(): Promise<Doador[]> {
        const query = `SELECT * FROM doador ORDER BY nome`;

        const { rows } = await db.query(query);

        return rows.map(row => new Doador(
            row.nome,
            row.cpf,
            row.email,
            row.id_doador // ID no final da instância
        ));
    }
}