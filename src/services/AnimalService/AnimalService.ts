import { Animal } from "@/models/Animal/Animal";
import { SexoAnimal, StatusAnimal, TipoAnimal } from "@/models/Enums/Enums";
import { AnimalRepository } from "@/repositories/AnimalRepository/AnimalRepository";
import { CuidadorRepository } from "@/repositories/CuidadorRepository/CuidadorRepository";
import { NecessidadeRepository } from "@/repositories/NecessidadeRepository/NecessidadeRepository";

export class AnimalService {

    private animalRepository: AnimalRepository;
    private cuidadorRepository: CuidadorRepository;
    private necessidadeRepository: NecessidadeRepository;

    constructor() {
        this.animalRepository = new AnimalRepository();
        this.cuidadorRepository = new CuidadorRepository();
        this.necessidadeRepository = new NecessidadeRepository();
    }

    // REGRA DE NEGÓCIO: O cuidador não pode ultrapassar 10 animais
    public async cadastrarAnimal(
        dados: {
            nome: string; tipo: TipoAnimal; raca: string; sexo: SexoAnimal;
            data_nascimento: Date; data_entrada_abrigo: Date; observacoes?: string;
        },
        id_cuidador: number) {

        // PASSO 1 - Verifica se o cuidador existe
        const cuidador = await this.cuidadorRepository.buscarPorId(id_cuidador);

        if (!cuidador) {
            throw new Error('Cuidador não encontrado.');
        }

        // PASSO 2 - Carrega os animais atuais do cuidador para aplicar a regra de limite
        const animaisAtuais = await this.animalRepository.listarPorCuidador(id_cuidador);
        cuidador.animais_sob_responsabilidade = animaisAtuais;

        // PASSO 3 - Instancia o novo animal (sem passar ID, pois será gerado pelo banco)
        const novoAnimal = new Animal(
            dados.nome,
            dados.tipo,
            dados.raca,
            dados.sexo,
            dados.data_nascimento,
            dados.data_entrada_abrigo,
            dados.observacoes || '',
            StatusAnimal.ATIVO
            // As necessidades iniciam vazias e o id_animal é omitido (undefined)
        );

        // PASSO 4 - A classe Cuidador valida a regra de negócio e lança erro se passar de 10
        cuidador.adicionarAnimal(novoAnimal);

        // PASSO 5 - Salva no banco e captura a nova instância que contém o id_animal gerado
        const animalSalvo = await this.animalRepository.salvar(novoAnimal, id_cuidador);

        return animalSalvo; // Agora retorna o objeto com o ID definitivo
    }

    // REGRA DE NEGÓCIO: Trazer o animal com suas necessidades (Composição)
    public async buscarAnimalCompleto(id_animal: number) {
        const animal = await this.animalRepository.buscarPorId(id_animal);
        if (!animal) {
            return null;
        }

        // Busca as necessidades e acopla ao objeto do animal
        const necessidades = await this.necessidadeRepository.listarPorAnimal(id_animal);
        animal.necessidades = necessidades;

        return animal;
    }

    public async atualizarStatus(id_animal: number, novoStatus: StatusAnimal, id_cuidador: number) {

        const animal = await this.animalRepository.buscarPorId(id_animal);

        if (!animal) {
            throw new Error('Animal não encontrado.');
        }

        animal.status = novoStatus;
        await this.animalRepository.atualizar(animal, id_cuidador);
    }

    public async listarPorCuidador(id_cuidador: number) {
        return this.animalRepository.listarPorCuidador(id_cuidador);
    }


    public async listarTodos() {
        return this.animalRepository.listarTodos();
    }

}