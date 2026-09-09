import { Suprimento } from "@/models/Suprimento/Suprimento";
import { SuprimentoRepository } from "@/repositories/SuprimentoRepository/SuprimentoRepository";


export class SuprimentoService {
    private suprimentoRepository: SuprimentoRepository;

    constructor() {
        this.suprimentoRepository = new SuprimentoRepository();
    }

    // REGRA DE NEGÓCIO: Cadastro inicial com geração de ID automático
    public async cadastrarSuprimento(dados: {
        nome: string;
        unidade: string;
        quantidadeEstoque: number;
        quantidadeMinima: number;
    }) {

        // Instancia o novo suprimento sem o pseudo-ID. O construtor já cuida do Math.floor para as quantidades.
        const novoSuprimento = new Suprimento(
            dados.nome,
            dados.unidade,
            dados.quantidadeEstoque,
            dados.quantidadeMinima,
            new Date(),
            true // ativo por padrão
        );

        // Captura a instância devolvida pelo Repository, que agora contém o ID gerado pelo banco
        const suprimentoSalvo = await this.suprimentoRepository.salvar(novoSuprimento);

        return suprimentoSalvo;
    }

    public async buscarPorId(id_suprimento: number) {
        return this.suprimentoRepository.buscarPorId(id_suprimento);
    }

    public async listar() {
        return this.suprimentoRepository.listar();
    }

    // Atualização restrita a dados cadastrais. 
    // A quantidade em estoque deve ser modificada via Doação (entrada) ou RegistroUso (saída).
    public async atualizarDadosCadastrais(
        id_suprimento: number,
        dados: {
            nome: string;
            unidade: string;
            quantidade_minima: number;
            ativo: boolean;
        }
    ) {

        const suprimento = await this.suprimentoRepository.buscarPorId(id_suprimento);
        if (!suprimento) {
            throw new Error('Suprimento não encontrado no estoque.');
        }

        suprimento.nome = dados.nome;
        suprimento.unidade = dados.unidade;
        suprimento.quantidade_minima = dados.quantidade_minima;
        suprimento.ativo = dados.ativo;

        await this.suprimentoRepository.atualizar(suprimento);
    }
}