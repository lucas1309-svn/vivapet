import { db } from "@/config/db";
import { ItemDoacao } from "@/models/ItemDoacao/ItemDoacao";

export class ItemDoacaoRepository {

    public async salvar(item: ItemDoacao, id_doacao: number) {
        const query = `INSERT INTO item_doacao 
        (quantidade, data_validade, observacoes, id_doacao, suprimento_id) 
        VALUES ($1, $2, $3, $4, $5)`;

        const values = [
            item.quantidade, // A classe já tratou para inteiro com Math.floor
            item.data_validade,
            item.observacoes,
            id_doacao,
            item.id_suprimento
        ];

        await db.query(query, values);
    }

    // Lista todos os itens de uma doação específica
    public async listarPorDoacao(id_doacao: number) {
        const query = `SELECT * FROM item_doacao WHERE id_doacao = $1`;
        const { rows } = await db.query(query, [id_doacao]);

        return rows.map(row => new ItemDoacao(
            row.id_item_doacao,
            row.quantidade,
            new Date(row.data_validade),
            row.id_suprimento,
            row.observacoes
        ));
    }
}