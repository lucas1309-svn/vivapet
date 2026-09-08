import { db } from "@/config/db";
import { AlertaEstoque } from "@/models/AlertaEstoque/AlertaEstoque";
import { StatusAlerta } from "@/models/Enums/Enums";

export class AlertaEstoqueRepository {


    public async salvar(alerta: AlertaEstoque) {
        const query = `INSERT INTO alerta_estoque 
        (data_alerta, mensagem, status, suprimento_id) 
        VALUES 
        ($1, $2, $3, $4)`;

        const values = [
            alerta.data_alerta,
            alerta.mensagem,
            alerta.status,
            alerta.id_suprimento
        ];

        await db.query(query, values);
    }



    public async buscarPorId(id_alerta_estoque: number) {
        const query = `SELECT * FROM alerta_estoque WHERE id = $1`;
        const { rows } = await db.query(query, [id_alerta_estoque]);

        if (rows.length === 0) {

            return null;
        }

        const row = rows[0];

        return new AlertaEstoque(
            row.id_alerta_estoque,
            new Date(row.data_alerta),
            row.mensagem,
            row.id_suprimento,
            row.status as StatusAlerta // convertendo a string vindo do banco de dados para Enum (Cast)
        );
    }



    //  Método útil para quando resolvermos o alerta (ex: chamar marcarComoResolvido())
    public async atualizar(alerta: AlertaEstoque) {
        const query = `UPDATE alerta_estoque SET status = $2, mensagem = $3 WHERE id = $1`;

        const values = [
            alerta.id_alerta_estoque,
            alerta.status,
            alerta.mensagem
        ];

        await db.query(query, values);
    }



    // Busca todos os alertas ativos (que ainda não foram resolvidos)
    public async listarAtivos() {
        const query = `SELECT * FROM alerta_estoque WHERE status = 'ATIVO' ORDER BY data_alerta DESC`;
        const { rows } = await db.query(query);

        return rows.map(row => new AlertaEstoque(
            row.id_alerta_estoque,
            new Date(row.data_alerta),
            row.mensagem,
            row.id_suprimento,
            row.status as StatusAlerta
        ));
    }
}