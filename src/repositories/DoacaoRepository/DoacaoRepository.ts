import { db } from "@/config/db";
import { Doacao } from "@/models/Doacao/Doacao";

export class DoacaoRepository {

    public async salvar(doacao: Doacao): Promise<Doacao> {
        const query = `
            INSERT INTO doacao (data_doacao, observacoes, id_doador) 
            VALUES ($1, $2, $3)
            RETURNING id_doacao
        `;

        const values = [
            doacao.data_doacao,
            doacao.observacoes,
            doacao.id_doador
        ];

        const { rows } = await db.query(query, values);

        return new Doacao(
            doacao.data_doacao,
            doacao.id_doador,
            doacao.itens, // Mantém o array de itens atual (provavelmente vazio na inserção inicial)
            doacao.observacoes,
            rows[0].id_doacao // ID gerado indo para o último parâmetro
        );
    }

    public async buscarPorId(id_doacao: number): Promise<Doacao | null> {
        const query = `SELECT * FROM doacao WHERE id_doacao = $1`;

        const { rows } = await db.query(query, [id_doacao]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Respeitando a ordem do construtor: data, id_doador, itens, observacoes, id_doacao
        return new Doacao(
            new Date(row.data_doacao),
            row.id_doador,
            [],  // Array referente aos itens de doação inicia vazio
            row.observacoes,
            row.id_doacao
        );
    }

    public async listarPorDoador(id_doador: number): Promise<Doacao[]> {
        const query = `SELECT * FROM doacao WHERE id_doador = $1 ORDER BY data_doacao DESC`;

        const { rows } = await db.query(query, [id_doador]);

        return rows.map(row => new Doacao(
            new Date(row.data_doacao),
            row.id_doador,
            [], // Array inicia vazio
            row.observacoes,
            row.id_doacao
        ));
    }
}