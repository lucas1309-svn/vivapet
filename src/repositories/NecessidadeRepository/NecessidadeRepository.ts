import { db } from "@/config/db";
import { Necessidade } from "@/models/Necessidade/Necessidade";

export class NecessidadeRepository {

    // Persiste uma nova necessidade vinculada a um animal específico
    public async salvar(necessidade: Necessidade, id_animal: number) {
        const query = `INSERT INTO necessidade 
        (descricao, observacoes, ativa, id_animal) 
        VALUES ($1, $2, $3, $4, $5)`;

        // Utiliza os getters públicos da classe de domínio
        const values = [
            necessidade.id_necessidade,
            necessidade.descricao,
            necessidade.observacoes,
            necessidade.ativa,
            id_animal
        ];

        await db.query(query, values);
    }



    // Busca uma necessidade específica pelo seu ID
    public async buscarPorId(id_necessidade: number) {
        const query = `SELECT * FROM necessidade WHERE id_necessidade = $1`;
        const { rows } = await db.query(query, [id_necessidade]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        // Instancia a classe Necessidade com os dados do banco
        return new Necessidade(
            row.id_necessidade,
            row.descricao,
            row.observacoes,
            row.ativa
        );
    }



    // Atualiza os dados de uma necessidade existente
    public async atualizar(necessidade: Necessidade, id_animal: number) {
        const query = `UPDATE necessidade SET descricao = $2, observacoes = $3, ativa = $4, animal_id = $5 WHERE id = $1`;

        const values = [
            necessidade.id_necessidade,
            necessidade.descricao,
            necessidade.observacoes,
            necessidade.ativa,
            id_animal
        ];

        await db.query(query, values);
    }



    // Lista todas as necessidades de um animal (Método essencial para a composição)
    public async listarPorAnimal(id_animal: number) {
        const query = `SELECT * FROM necessidade WHERE id_animal = $1 ORDER BY descricao`;
        const { rows } = await db.query(query, [id_animal]);

        return rows.map(row => new Necessidade(
            row.id_necessidade,
            row.descricao,
            row.observacoes,
            row.ativa
        ));
    }



    // Como é uma relação de composição, faz sentido ter um método para deletar a necessidade fisicamente
    public async deletar(id_necessidade: string) {
        const query = `DELETE FROM necessidade WHERE id = $1`;
        await db.query(query, [id_necessidade]);
    }
}
