import { db } from "@/config/db";
import { Doacao } from "@/models/Doacao/Doacao";

export class DoacaoRepository {

    public async salvar(doacao: Doacao) {
        const query = `INSERT INTO doacao 
        (id_doacao, data_doacao, observacoes, doador_id) 
        VALUES ($1, $2, $3, $4`;

        const values = [
            doacao.id_doacao,
            doacao.data_doacao,
            doacao.observacoes,
            doacao.id_doador
        ];

        await db.query(query, values);
    }



    public async buscarPorId(id: number) {
        const query = `SELECT * FROM doacao WHERE id = $1`;

        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // O array de Itens inicia vazio
        return new Doacao(
            row.id_doacao,
            new Date(row.data_doacao),
            row.id_doador,
            [],  // Array referente aos itens de doação 
            row.observacoes
        );
    }



    public async listarPorDoador(id_doador: number) {

        const query = `SELECT * FROM doacao WHERE doador_id = $1 ORDER BY data_doacao DESC`;

        const { rows } = await db.query(query, [id_doador]);

        return rows.map(row => new Doacao(
            row.id_doacao,
            new Date(row.data_doacao),
            row.id_doador,
            [],
            row.observacoes)
        );
    }

}