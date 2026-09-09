import { db } from "@/config/db";
import { Necessidade } from "@/models/Necessidade/Necessidade";

export class NecessidadeRepository {

    // Persiste uma nova necessidade vinculada a um animal específico
    public async salvar(necessidade: Necessidade, id_animal: number): Promise<Necessidade> {
        const query = `
            INSERT INTO necessidade (descricao, observacoes, ativa, id_animal) 
            VALUES ($1, $2, $3, $4)
            RETURNING id_necessidade
        `;

        const values = [
            necessidade.descricao,
            necessidade.observacoes,
            necessidade.ativa,
            id_animal
        ];

        const { rows } = await db.query(query, values);

        return new Necessidade(
            necessidade.descricao,
            necessidade.observacoes,
            necessidade.ativa,
            rows[0].id_necessidade // ID gerado recebendo o último slot
        );
    }

    // Busca uma necessidade específica pelo seu ID
    public async buscarPorId(id_necessidade: number): Promise<Necessidade | null> {
        const query = `SELECT * FROM necessidade WHERE id_necessidade = $1`;
        const { rows } = await db.query(query, [id_necessidade]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Instancia a classe Necessidade respeitando a ordem do construtor
        return new Necessidade(
            row.descricao,
            row.observacoes,
            row.ativa,
            row.id_necessidade
        );
    }

    // Atualiza os dados de uma necessidade existente
    public async atualizar(necessidade: Necessidade, id_animal: number): Promise<void> {
        if (!necessidade.id_necessidade) {
            throw new Error("Não é possível atualizar uma necessidade que não possui ID.");
        }

        // Colunas ajustadas para id_animal e id_necessidade
        const query = `
            UPDATE necessidade 
            SET descricao = $1, observacoes = $2, ativa = $3, id_animal = $4 
            WHERE id_necessidade = $5
        `;

        const values = [
            necessidade.descricao,
            necessidade.observacoes,
            necessidade.ativa,
            id_animal,
            necessidade.id_necessidade
        ];

        await db.query(query, values);
    }

    // Lista todas as necessidades de um animal (Método essencial para a composição)
    public async listarPorAnimal(id_animal: number): Promise<Necessidade[]> {
        const query = `SELECT * FROM necessidade WHERE id_animal = $1 ORDER BY descricao`;
        const { rows } = await db.query(query, [id_animal]);

        return rows.map(row => new Necessidade(
            row.descricao,
            row.observacoes,
            row.ativa,
            row.id_necessidade // ID no final da instância
        ));
    }

    // Como é uma relação de composição, faz sentido ter um método para deletar a necessidade fisicamente
    public async deletar(id_necessidade: number): Promise<void> { // Tipo alterado de string para number
        const query = `DELETE FROM necessidade WHERE id_necessidade = $1`; // Coluna ajustada
        await db.query(query, [id_necessidade]);
    }
}