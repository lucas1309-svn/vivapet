import { Necessidade } from "@/models/Necessidade/Necessidade";
import { NecessidadeRepository } from "@/repositories/NecessidadeRepository/NecessidadeRepository";
import { AnimalRepository } from "@/repositories/AnimalRepository/AnimalRepository";

export class NecessidadeService {
    private necessidadeRepository: NecessidadeRepository;
    private animalRepository: AnimalRepository;

    constructor() {
        this.necessidadeRepository = new NecessidadeRepository();
        this.animalRepository = new AnimalRepository();
    }

    public async cadastrar(dados: { descricao: string; observacoes?: string; ativa: boolean; id_animal: number }) {
        // Valida se o animal existe no banco de dados antes de registrar a necessidade
        const animal = await this.animalRepository.buscarPorId(dados.id_animal);
        if (!animal) {
            throw new Error("Não é possível cadastrar uma necessidade: Animal não encontrado.");
        }

        const novaNecessidade = new Necessidade(
            dados.descricao,
            dados.observacoes || '',
            dados.ativa
        );

        return await this.necessidadeRepository.salvar(novaNecessidade, dados.id_animal);
    }

    public async atualizar(id_necessidade: number, dados: { descricao: string; observacoes?: string; ativa: boolean; id_animal: number }) {
        // Valida se a necessidade existe
        const necessidadeExistente = await this.necessidadeRepository.buscarPorId(id_necessidade);
        if (!necessidadeExistente) {
            throw new Error("Necessidade não encontrada.");
        }

        // Valida se o animal existe
        const animal = await this.animalRepository.buscarPorId(dados.id_animal);
        if (!animal) {
            throw new Error("Animal vinculado não encontrado.");
        }

        // Atualiza os dados da entidade
        necessidadeExistente.descricao = dados.descricao;
        necessidadeExistente.observacoes = dados.observacoes || '';
        necessidadeExistente.ativa = dados.ativa;

        await this.necessidadeRepository.atualizar(necessidadeExistente, dados.id_animal);

        return necessidadeExistente;
    }
}