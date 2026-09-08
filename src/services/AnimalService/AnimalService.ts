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


        // PASSO 3 - Instancia o novo animal (gerando um UUID automático)
        const novoAnimal = new Animal(
            0,
            dados.nome,
            dados.tipo,
            dados.raca,
            dados.sexo,
            dados.data_nascimento,
            dados.data_entrada_abrigo,
            dados.observacoes || '',
            StatusAnimal.ATIVO
        );


        // PASSE 4 - A classe Cuidador valida a regra de negócio e lança erro se passar de 10
        cuidador.adicionarAnimal(novoAnimal);


        // PASSE 5 - Se passou pela validação, salva no banco de dados
        await this.animalRepository.salvar(novoAnimal, id_cuidador);

        return novoAnimal;
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
}