import { db } from "@/config/db";
import { Suprimento } from "@/models/Suprimento/Suprimento";


export class SuprimentoRepository {

    // MÉTODO PARA SALVAR UM SUPRIMENTO NA BASE DE DADOS:
    public async salvar(suprimento: Suprimento): Promise<Suprimento> {
        const query = `
            INSERT INTO suprimento (nome, unidade, quantidade_estoque, quantidade_minima, data_cadastro, ativo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_suprimento
        `;

        const values = [
            suprimento.nome,
            suprimento.unidade,
            suprimento.quantidade_estoque,
            suprimento.quantidade_minima,
            suprimento.data_cadastro,
            suprimento.ativo
        ];

        const { rows } = await db.query(query, values);

        return new Suprimento(
            suprimento.nome,
            suprimento.unidade,
            suprimento.quantidade_estoque,
            suprimento.quantidade_minima,
            suprimento.data_cadastro,
            suprimento.ativo,
            rows[0].id_suprimento // ID gerado pelo banco recebendo o último slot
        );
    }

    // MÉTODO PARA ATUALIZAR OS DADOS DE UM SUPRIMENTO NA BASE DE DADOS:
    public async atualizar(suprimento: Suprimento): Promise<void> {
        // Trava de segurança
        if (!suprimento.id_suprimento) {
            throw new Error("Não é possível atualizar um suprimento que não possui ID.");
        }

        const query = `
            UPDATE suprimento 
            SET nome = $1, unidade = $2, quantidade_estoque = $3, quantidade_minima = $4, ativo = $5 
            WHERE id_suprimento = $6
        `;

        const values = [
            suprimento.nome,
            suprimento.unidade,
            suprimento.quantidade_estoque,
            suprimento.quantidade_minima,
            suprimento.ativo,
            suprimento.id_suprimento
        ];

        await db.query(query, values);
    }

    // BUSCAR UM TIPO DE SUPRIMENTO POR ID:
    public async buscarPorId(id_suprimento: number): Promise<Suprimento | null> {
        const query = `SELECT * FROM suprimento WHERE id_suprimento = $1`;
        const { rows } = await db.query(query, [id_suprimento]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Ordem respeitando o construtor do Model
        return new Suprimento(
            row.nome,
            row.unidade,
            row.quantidade_estoque,
            row.quantidade_minima,
            new Date(row.data_cadastro),
            row.ativo,
            row.id_suprimento
        );
    }

    // LISTAR TODOS OS SUPRIMENTOS:
    public async listar(): Promise<Suprimento[]> {
        const query = `SELECT * FROM suprimento ORDER BY id_suprimento`;
        const { rows } = await db.query(query);

        return rows.map(row => new Suprimento(
            row.nome,
            row.unidade,
            row.quantidade_estoque,
            row.quantidade_minima,
            new Date(row.data_cadastro),
            row.ativo,
            row.id_suprimento
        ));
    }
}