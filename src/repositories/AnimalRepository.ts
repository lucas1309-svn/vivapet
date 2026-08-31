import { db } from "@/config/db"
import { Animal } from "@/models/Animal/Animal"
import { SexoAnimal, StatusAnimal, TipoAnimal } from "@/models/Enums/Enums"

export class AnimalRepository{

    
    public async salvar(animal: Animal, id_cuidador: number){

        const query = `INSERT INTO animal (id_animal, nome, tipo, raca, sexo, data_nascimento, observacoes, status, data_entrada_abrigo, id_cuidador, )
        VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8, $9, $10)`

        const values = [animal.id, animal.nome, animal.tipo, animal.raca, animal.sexo, animal.dataNascimento, animal.dataEntradaAbrigo]

        await db.query(query, values)
    }


    public async buscarPorId(id_animal: number){

        const query = `SELECT * FROM animal WHERE id_animal = $1`

        const { rows } = await db.query(query, [id_animal])

        if (rows.length === 0) {
                    return null
                }
        
                const row = rows[0]
        
                return new Animal(row.id_animal, row.nome, row.tipo as TipoAnimal, row.raca, row.sexo as SexoAnimal, new Date (row.data_nascimento), new Date (row.data_entrada_abrigo), row.observacoes, row.status as StatusAnimal )
    }



    public async atualizar(animal: Animal, id_cuidador: number){

        const query = `UPTADE cuidador SET  nome = $2, tipo = $3, raca = $4, sexo = $5, data_nascimento = $6, observacoes = $7, status = $8, data_entrada_abrigo, id_cuidador = $9  WHERE id_animal = $1`

        const values = [animal.id, animal.nome, animal.tipo, animal.raca, animal.sexo, animal.dataNascimento, animal.observacoes, animal.status, id_cuidador]

        await db.query(query, values)
    }


    
}