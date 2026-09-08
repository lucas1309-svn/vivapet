import { Doacao } from "@/models/Doacao/Doacao";
import { ItemDoacao } from "@/models/ItemDoacao/ItemDoacao";
import { DoacaoRepository } from "@/repositories/DoacaoRepository/DoacaoRepository";
import { DoadorRepository } from "@/repositories/DoadorRepository/DoadorRepository";
import { ItemDoacaoRepository } from "@/repositories/ItemDoacaoRepository/ItemDoacaoRepository";
import { SuprimentoRepository } from "@/repositories/SuprimentoRepository/SuprimentoRepository";



export class DoacaoService{

    private doacaoRepository: DoacaoRepository;
    private itemDoacaoRepository: ItemDoacaoRepository;
    private doadorRepository: DoadorRepository;
    private suprimentoRepository: SuprimentoRepository;

    constructor(){

        this.doacaoRepository = new DoacaoRepository();
        this.itemDoacaoRepository = new ItemDoacaoRepository();
        this.doadorRepository = new DoadorRepository();
        this.suprimentoRepository = new SuprimentoRepository();
    }

    // REGRA DE NEGOCIO - REGISTRAR A DOAÇÃO, SEUS ITENS E ICREMENTAR O ESTOQUE

    public async registrarDoacao(dados: {
        id_doador: number;
        observacoes?: string;
        
        itens: {
            id_suprimento: number;
            quantidade: number;
            data_validade: Date;
            observacoes: string
        }[];
    } )
    
    
    {

        // PASSO 1 - VERIFICAR SE O DOADOR EXISTE
        const doador = await this.doadorRepository.buscarPorId(dados.id_doador)

        if(!doador){
            throw new Error('Doador não encontrado')
        }

        // CHECAR SE VEIO ITENS DA TELA

        if(!dados.itens || dados.itens.length === 0){
            throw new Error('Uma doação precisa conter pelo menos um item');
        }

        // PASSO 2 - A INSTANCIA DE DOAÇÃO PRINCIPAL

        const novaDoacao = new Doacao(
            0,
            new Date(),
            dados.id_doador,
            [],
            dados.observacoes
        )

        // PASSO 3 - PREENCHER O ARRAY DE ITENS

        for(const itemDoado of dados.itens){
            const suprimento = await this.suprimentoRepository.buscarPorId(itemDoado.id_suprimento);

            if(!suprimento){
                throw new Error('Suprimento não encontrado no sistema!')
            }

            // CRIAR A INSTANCIA DO ITEM

            const novoItem = new ItemDoacao(
                0, 
                itemDoado.quantidade, 
                itemDoado.data_validade, 
                itemDoado.id_suprimento, 
                itemDoado.observacoes
            );

            novaDoacao.itens.push(novoItem);

            // REGRA DE NEGOCIO - INCREMENTAR ESTOQUE DO SUPRIMENTO

           suprimento.quantidade_estoque =  suprimento.quantidade_estoque + novoItem.quantidade;

            await this.suprimentoRepository.atualizar(suprimento)
        }

        // PASSO 4 - PERSISTIR A DOAÇÃO E SEUS ITENS:
     await this.doacaoRepository.salvar(novaDoacao)

     for(const item of novaDoacao.itens){
        await this.itemDoacaoRepository.salvar(item, novaDoacao.id_doacao)
     }

     return novaDoacao

    }

    // REGRA DE NEGÓCIO - TRAZ A DOAÇÃO COMPLETA (RELACIONAMENTO DE COMPOSIÇÃO)

    public async buscarDoacaoCompleta(id_doacao: number){

        const doacao = await this.doacaoRepository.buscarPorId(id_doacao)

        if(!doacao){
            return null
        }

        const itens = await this.itemDoacaoRepository.listarPorDoacao(id_doacao)

        doacao.itens = itens

        return doacao
    }

     
}