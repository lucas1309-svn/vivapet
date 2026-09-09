import { Doacao } from "@/models/Doacao/Doacao";
import { ItemDoacao } from "@/models/ItemDoacao/ItemDoacao";
import { DoacaoRepository } from "@/repositories/DoacaoRepository/DoacaoRepository";
import { DoadorRepository } from "@/repositories/DoadorRepository/DoadorRepository";
import { ItemDoacaoRepository } from "@/repositories/ItemDoacaoRepository/ItemDoacaoRepository";
import { SuprimentoRepository } from "@/repositories/SuprimentoRepository/SuprimentoRepository";

export class DoacaoService {
    private doacaoRepository: DoacaoRepository;
    private itemDoacaoRepository: ItemDoacaoRepository;
    private suprimentoRepository: SuprimentoRepository;
    private doadorRepository: DoadorRepository;

    constructor() {
        this.doacaoRepository = new DoacaoRepository();
        this.itemDoacaoRepository = new ItemDoacaoRepository();
        this.suprimentoRepository = new SuprimentoRepository();
        this.doadorRepository = new DoadorRepository();
    }

    // REGRA DE NEGÓCIO - Registrar a doação, seus itens e incrementar o estoque
    public async registrarDoacao(dados: {
        id_doador: number;
        observacoes?: string;
        itens: {
            id_suprimento: number;
            quantidade: number;
            data_validade: Date;
            observacoes?: string;
        }[];
    }) {

        // PASSO 1 - Verifica se o doador existe
        const doador = await this.doadorRepository.buscarPorId(dados.id_doador);
        if (!doador) {
            throw new Error('Doador não encontrado.');
        }

        if (!dados.itens || dados.itens.length === 0) {
            throw new Error('Uma doação precisa conter pelo menos um item.');
        }

        // PASSO 2 - Instancia a Doação principal (sem o pseudo-ID)
        const novaDoacao = new Doacao(
            new Date(),
            dados.id_doador,
            [], // Inicia com array vazio, preencheremos a seguir
            dados.observacoes || ''
        );

        // PASSO 3 - Prepara os itens e atualiza o estoque em memória
        // *Nota: Em produção, iterar no banco assim pede uma transação SQL (BEGIN/COMMIT)
        for (const itemDado of dados.itens) {
            const suprimento = await this.suprimentoRepository.buscarPorId(itemDado.id_suprimento);

            if (!suprimento) {
                throw new Error(`Suprimento de ID ${itemDado.id_suprimento} não encontrado no sistema.`);
            }

            // Cria a instância do item (sem o pseudo-ID e na ordem correta)
            const novoItem = new ItemDoacao(
                itemDado.quantidade,
                itemDado.data_validade,
                itemDado.id_suprimento,
                itemDado.observacoes || ''
            );

            novaDoacao.itens.push(novoItem);

            // REGRA DE NEGÓCIO - Incrementa o estoque do suprimento
            suprimento.quantidade_estoque = suprimento.quantidade_estoque + novoItem.quantidade;
            await this.suprimentoRepository.atualizar(suprimento);
        }

        // PASSO 4 - Persiste a Doação Pai e captura o ID gerado pelo banco
        const doacaoSalva = await this.doacaoRepository.salvar(novaDoacao);

        // Trava de segurança para garantir ao TypeScript que a doação foi salva e tem ID
        if (!doacaoSalva.id_doacao) {
            throw new Error('Falha ao gerar ID da doação no banco de dados.');
        }

        // Salva os itens vinculando-os ao ID da doação recém-criada
        const itensSalvos: ItemDoacao[] = [];
        for (const item of novaDoacao.itens) {
            const itemSalvo = await this.itemDoacaoRepository.salvar(item, doacaoSalva.id_doacao);
            itensSalvos.push(itemSalvo);
        }

        // Atualiza a doação salva com os itens que agora também possuem seus próprios IDs do banco
        doacaoSalva.itens = itensSalvos;

        return doacaoSalva;
    }

    // Regra de Negócio: Traz a doação completa (Composição)
    public async buscarDoacaoCompleta(id_doacao: number) {
        const doacao = await this.doacaoRepository.buscarPorId(id_doacao);
        if (!doacao) {
            return null;
        }

        const itens = await this.itemDoacaoRepository.listarPorDoacao(id_doacao);
        doacao.itens = itens;

        return doacao;
    }
}