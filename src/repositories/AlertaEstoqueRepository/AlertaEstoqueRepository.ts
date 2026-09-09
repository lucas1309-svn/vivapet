import { db } from "@/config/db";
import { AlertaEstoque } from "@/models/AlertaEstoque/AlertaEstoque";
import { StatusAlerta } from "@/models/Enums/Enums";

export class AlertaEstoqueRepository {

    public async salvar(alerta: AlertaEstoque): Promise<AlertaEstoque> {
        const query = `
            INSERT INTO alerta_estoque (data_alerta, mensagem, status, id_suprimento) 
            VALUES ($1, $2, $3, $4)
            RETURNING id_alerta_estoque
        `;

        const values = [
            alerta.data_alerta,
            alerta.mensagem,
            alerta.status,
            alerta.id_suprimento
        ];

        const { rows } = await db.query(query, values);

        return new AlertaEstoque(
            alerta.data_alerta,
            alerta.mensagem,
            alerta.id_suprimento,
            alerta.status,
            rows[0].id_alerta_estoque
        );
    }

    public async buscarPorId(id_alerta_estoque: number): Promise<AlertaEstoque | null> {
        const query = `SELECT * FROM alerta_estoque WHERE id_alerta_estoque = $1`;
        const { rows } = await db.query(query, [id_alerta_estoque]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // O ID passa a ser o último parâmetro da reconstrução
        return new AlertaEstoque(
            new Date(row.data_alerta),
            row.mensagem,
            row.id_suprimento,
            row.status as StatusAlerta,
            row.id_alerta_estoque
        );
    }

    public async atualizar(alerta: AlertaEstoque): Promise<void> {
        if (!alerta.id_alerta_estoque) {
            throw new Error("Não é possível atualizar um alerta que não possui ID.");
        }

        const query = `UPDATE alerta_estoque SET status = $1, mensagem = $2 WHERE id_alerta_estoque = $3`;

        const values = [
            alerta.status,
            alerta.mensagem,
            alerta.id_alerta_estoque
        ];

        await db.query(query, values);
    }

    public async listarAtivos(): Promise<AlertaEstoque[]> {
        const query = `SELECT * FROM alerta_estoque WHERE status = 'ATIVO' ORDER BY data_alerta DESC`;
        const { rows } = await db.query(query);

        return rows.map(row => new AlertaEstoque(
            new Date(row.data_alerta),
            row.mensagem,
            row.id_suprimento,
            row.status as StatusAlerta,
            row.id_alerta_estoque
        ));
    }
}