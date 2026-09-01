import { db } from "@/config/db";
import { Suprimento } from "@/models/Suprimento/Suprimento";


export class SuprimentoRepository {


    // MÉTODO PARA SALVAR UM SUPRIMENTO NA BASE DE DADOS:

    public async salvar(suprimento: Suprimento) {

        const query = `INSERT INTO suprimento
        (nome, unidade, quantidade_estoque, quantidade_minima, data_cadastro, ativo)
        VALUES
        ($1, $2, $3, $4, $5, $6)`;

        const values = [suprimento.nome, suprimento.unidade, suprimento.quantidade_estoque, suprimento.quantidade_minima, suprimento.data_cadastro, suprimento.ativo];

        await db.query(query, values);
    }



    // MÉTODO PARA ATUALIZAR OS DADOS DE UM SUPRIMENTO NA BASE DE DADOS:

    public async atualizar(suprimento: Suprimento) {

        const query = `UPDATE suprimento SET 
        nome = $2, unidade = $3, quantidade_estoque = $4, quantidade_minima = $5, ativo = $6 WHERE suprimento_id = $1`;

        const values = [suprimento.id_suprimento, suprimento.nome, suprimento.unidade, suprimento.quantidade_estoque, suprimento.quantidade_minima, suprimento.ativo];

        await db.query(query, values);
    }



    // BUSCAR UM TIPO DE SUPRIMENTO POR ID:

    public async buscarPorId(id_suprimento: number) {
        const query = `SELECT * FROM suprimento WHERE id_suprimento = $1`;

        const { rows } = await db.query(query, [id_suprimento]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Suprimento(
            row.id, row.nome, row.unidade, row.quantidade_estoque, row.quantidade_minima, new Date(row.data_cadastro), row.ativo
        );
    }


    // LISTAR TODOS OS SUPRIMENTOS:

    public async listar() {

        const query = `SELECT * FROM suprimento ORDER BY id_suprimento`;

        const { rows } = await db.query(query);

        return rows.map(row => new Suprimento(
            row.id, row.nome, row.unidade, row.quantidade_estoque, row.quantidade_minima, new Date(row.data_cadastro), row.ativo
        ));

    }

}