import { db } from "@/config/db";
import { Cuidador } from "@/models/Cuidador/Cuidador";

export class CuidadorRepository {

    // MÉTODO PARA SALVAR UM CUIDADOR NA BASE DE DADOS:
    public async salvar(cuidador: Cuidador): Promise<Cuidador> {
        const query = `
            INSERT INTO cuidador (nome, cpf, email, data_cadastro, ativo) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_cuidador
        `;

        const values = [
            cuidador.nome,
            cuidador.cpf,
            cuidador.email,
            cuidador.data_cadastro,
            cuidador.ativo
        ];

        const { rows } = await db.query(query, values);

        return new Cuidador(
            cuidador.nome,
            cuidador.cpf,
            cuidador.email,
            cuidador.data_cadastro,
            cuidador.ativo,
            rows[0].id_cuidador // O ID gerado vai para o final
        );
    }

    // LISTAR TODOS OS CUIDADORES:
    public async listar(): Promise<Cuidador[]> {
        const query = `SELECT * FROM cuidador ORDER BY id_cuidador`;
        const { rows } = await db.query(query);

        return rows.map(row => new Cuidador(
            row.nome,
            row.cpf,
            row.email,
            new Date(row.data_cadastro),
            row.ativo,
            row.id_cuidador // O ID agora é o último parâmetro
        ));
    }

    // MÉTODO PARA ATUALIZAR OS DADOS DE UM CUIDADOR NA BASE DE DADOS:
    public async atualizar(cuidador: Cuidador): Promise<void> {
        // Trava de segurança para o TypeScript e para o banco
        if (!cuidador.id_cuidador) {
            throw new Error("Não é possível atualizar um cuidador que não possui ID.");
        }

        const query = `
            UPDATE cuidador 
            SET nome = $1, cpf = $2, email = $3, ativo = $4 
            WHERE id_cuidador = $5
        `;

        const values = [
            cuidador.nome,
            cuidador.cpf,
            cuidador.email,
            cuidador.ativo,
            cuidador.id_cuidador
        ];

        await db.query(query, values);
    }

    // BUSCAR UM CUIDADOR POR ID:
    public async buscarPorId(id_cuidador: number): Promise<Cuidador | null> {
        const query = `SELECT * FROM cuidador WHERE id_cuidador = $1`;
        const { rows } = await db.query(query, [id_cuidador]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Cuidador(
            row.nome,
            row.cpf,
            row.email,
            new Date(row.data_cadastro),
            row.ativo,
            row.id_cuidador
        );
    }
}