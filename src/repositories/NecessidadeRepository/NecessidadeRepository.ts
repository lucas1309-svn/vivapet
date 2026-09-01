import { db } from "@/config/db";
import { Necessidade } from "@/models/Necessidade/Necessidade";

export class NecessidadeRepository{

    public async salvar(necessidade: Necessidade, id_animal: number){

        const query = `INSERT INTO necessidade (descricao, observacoes, ativa, id_animal)
        VALUES ($1, $2, $3, $4)`

        const values = [necessidade.descricao, necessidade.observacoes, necessidade.ativa, id_animal]

        await db.query(query, values)
    }
}