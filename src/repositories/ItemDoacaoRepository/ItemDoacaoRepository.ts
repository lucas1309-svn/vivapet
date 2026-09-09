import { db } from "@/config/db";
import { ItemDoacao } from "@/models/ItemDoacao/ItemDoacao";

export class ItemDoacaoRepository {

    public async salvar(item: ItemDoacao, id_doacao: number): Promise<ItemDoacao> {
        const query = `
            INSERT INTO item_doacao (quantidade, data_validade, observacoes, id_doacao, id_suprimento) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_item_doacao
        `;

        const values = [
            item.quantidade, // A classe já tratou para inteiro com Math.floor
            item.data_validade,
            item.observacoes,
            id_doacao,
            item.id_suprimento
        ];

        const { rows } = await db.query(query, values);

        return new ItemDoacao(
            item.quantidade,
            item.data_validade,
            item.id_suprimento,
            item.observacoes,
            rows[0].id_item_doacao // ID gerado pelo banco recebendo o último slot
        );
    }

    // Lista todos os itens de uma doação específica
    public async listarPorDoacao(id_doacao: number): Promise<ItemDoacao[]> {
        const query = `SELECT * FROM item_doacao WHERE id_doacao = $1`;
        const { rows } = await db.query(query, [id_doacao]);

        return rows.map(row => new ItemDoacao(
            row.quantidade,
            new Date(row.data_validade),
            row.id_suprimento, // Consistência com o nome da coluna no banco
            row.observacoes,
            row.id_item_doacao // ID no final da instância
        ));
    }
}