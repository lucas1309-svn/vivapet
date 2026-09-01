import { db } from "@/config/db";
import { Cuidador } from "@/models/Cuidador/Cuidador";

export class CuidadorRepository {

    // MÉTODO PARA SALVAR UM CUIDADOR NA BASE DE DADOS:
    public async salvar(cuidador: Cuidador) {

        const query = `INSERT INTO cuidador (nome, cpf, email, data_cadastro, ativo) VALUES ($1, $2, $3, $4, $5, $6)`;

        const values = [cuidador.nome, cuidador.cpf, cuidador.email, cuidador.data_cadastro, cuidador.ativo];

        await db.query(query, values);
    }



    // LISTAR TODOS OS CUIDADORES:
    public async listar() {

        const query = `SELECT * FROM cuidador ORDER BY id_cuidador`;

        const { rows } = await db.query(query);

        return rows.map(row => new Cuidador(
            row.id_cuidador, row.nome, row.cpf, row.email, new Date(row.data_cadastro), row.ativo
        ));
    }



    // MÉTODO PARA ATUALIZAR OS DADOS DE UM CUIDADOR NA BASE DE DADOS:
    public async atualizar(cuidador: Cuidador) {

        const query = `UPDATE cuidador SET nome = $2, cpf = $3, email = $4, ativo = $5 WHERE id_cuidador = $1`;

        const values = [cuidador.id_cuidador, cuidador.nome, cuidador.cpf, cuidador.email, cuidador.ativo];

        await db.query(query, values);
    }



    // BUSCAR UM CUIDADOR POR ID:
    public async buscarPorId(id: number) {

        const query = `SELECT * FROM cuidador WHERE id_cuidador = $1`;

        const { rows } = await db.query(query, [id]);

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new Cuidador(row.id, row.nome, row.cpf, row.email, new Date(row.data_cadastro), row.ativo);
    }
    
}