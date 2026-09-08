import { db } from "@/config/db";
import { Doador } from "@/models/Doador/Doador";


export class DoadorRepository {

    public async salvar(doador: Doador) {
        const query = `INSERT INTO doador 
        (id, nome, cpf, email) 
        VALUES ($1, $2, $3, $4)`;

        const values = [
            doador.id_doador,
            doador.nome,
            doador.cpf,
            doador.email
        ];

        await db.query(query, values);
    }



    public async buscarPorId(id_doador: number) {
        const query = `SELECT * FROM doador WHERE id = $1`;

        const { rows } = await db.query(query, [id_doador]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Doador(
            row.id_doador,
            row.nome,
            row.cpf,
            row.email
        );
    }



    public async atualizar(doador: Doador): Promise<void> {
        const query = `UPDATE doador SET nome = $2, cpf = $3, email = $4 WHERE id_doador = $1`;

        const values = [
            doador.id_doador,
            doador.nome,
            doador.cpf,
            doador.email
        ];

        await db.query(query, values);
    }



    public async listarTodos() {
        const query = `SELECT * FROM doador ORDER BY nome`;

        const { rows } = await db.query(query);

        return rows.map(row => new Doador(
            row.id,
            row.nome,
            row.cpf,
            row.email
        ));
    }

}