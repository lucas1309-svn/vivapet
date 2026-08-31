import { db } from "@/config/db";
import { Cuidador } from "@/models/Cuidador/Cuidador";

export class CuidadorRepository {

    public async salvar(cuidador: Cuidador) {

        const query = `INSERT INTO cuidador (id, nome, cpf, email, data_cadastro, ativo) VALUES ($1, $2, $3, $4, $5, $6)`;

        const values = [cuidador.id, cuidador.nome, cuidador.email, cuidador.data_cadastro, cuidador.ativo];

        await db.query(query, values);
    }


    public async listar() {

        const query = `SELECT * FROM cuidador ORDER BY id_cuidador`;

        const { rows } = await db.query(query);

        return rows.map(row => new Cuidador(
            row.id, row.nome, row.cpf, row.telefone, row.email, new Date(row.data_cadastro), row.ativo
        ))
    }




    // METODO PARA ATUALIZAR UM CUIDADOR NA BASE DE DADOS


    public async atualizar(cuidador: Cuidador) {

        const query = `UPDATE cuidador SET nome = $2, cpf = $3, email = $4, ativo = $5 WHERE id_cuidador = $1`

        const values = [cuidador.id, cuidador.nome, cuidador.email, cuidador.cpf, cuidador.ativo]

        await db.query(query, values)
    }


    //BUSCAR UM TIPO DE CUIDADOR POR ID

    public async byscarPorId(id: number) {

        const query = `SELECT * FROM cuidado WHERE id_cuidador = $1`;

        const { rows } = await db.query(query, [id])

        if (rows.length === 0) {
            return null
        }

        const row = rows[0]

        return new Cuidador(row.id, row.nome, row.cpf, row.telefone, row.email, new Date(row.data_cadastro), row.ativo)
    }
}