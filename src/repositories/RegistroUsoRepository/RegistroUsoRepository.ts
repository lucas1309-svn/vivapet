import { db } from "@/config/db";
import { RegistroUso } from "@/models/RegistroUso/RegistroUso";

export class RegistroUsoRepository{

    public async salvar(registro: RegistroUso){

        const query = `INSERT INTO registro_uso (data_uso, quantidade_usada, observacoes, id_animal, id_suprimento, id_cuidador)
        VALUES ($1, $2, $3, $,3, $4, $5, $6)`;

        const values = [registro.data_uso, registro.quantidade_usada, registro.observacoes, registro.id_animal, registro.id_suprimento, registro.id_cuidador]

        await db.query(query, values)
    }

    public async buscaPorId(id_registro_uso: number){

        const query = `SELECT * FROM registro_uso WHERE id_registro_uso = $1`;

        const { rows } = await db.query(query, [id_registro_uso]);

        if(rows.length === 0 ) {
            return null
        }

        const row = rows[0]

        return new RegistroUso(row.id_registro_uso, new Date(row.data_uso), row.quantidade_usada, row.id_cuidador, row.id_animal, row.id_suprimento, row.observacoes);
    }


//LISTAR TODO HISTORICO DE CONSUMO DE UM ANIMAL ESPECIFICO


        public async buscarPorAnimal(id_animal: number){

            const query = `SELECT * FROM registro_uso WHERE id_animal = $1`;

            const { rows } = await db.query(query, [id_animal])

            rows.map(row => new RegistroUso(row.id_registro_uso, new Date(row.data_uso), row.quantidade_usada, row.id_cuidador, row.id_animal, row.id_suprimento, row.observacoes))
        }



         public async buscarPorSuprimento(id_animal: number){

            const query = `SELECT * FROM registro_uso WHERE id_suprimento = $1`;

            const { rows } = await db.query(query, [id_animal])

            rows.map(row => new RegistroUso(row.id_registro_uso, new Date(row.data_uso), row.quantidade_usada, row.id_cuidador, row.id_suprimento, row.id_suprimento, row.observacoes))
        }
}