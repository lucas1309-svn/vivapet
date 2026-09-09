import { AlertaEstoque } from "@/models/AlertaEstoque/AlertaEstoque";
import { StatusAlerta } from "@/models/Enums/Enums";
import { RegistroUso } from "@/models/RegistroUso/RegistroUso";
import { AlertaEstoqueRepository } from "@/repositories/AlertaEstoqueRepository/AlertaEstoqueRepository";
import { RegistroUsoRepository } from "@/repositories/RegistroUsoRepository/RegistroUsoRepository";
import { SuprimentoRepository } from "@/repositories/SuprimentoRepository/SuprimentoRepository";

export class RegistroUsoService {
    private registroUsoRepository: RegistroUsoRepository;
    private suprimentoRepository: SuprimentoRepository;
    private alertaEstoqueRepository: AlertaEstoqueRepository;

    constructor() {
        this.registroUsoRepository = new RegistroUsoRepository();
        this.suprimentoRepository = new SuprimentoRepository();
        this.alertaEstoqueRepository = new AlertaEstoqueRepository();
    }

    // Regra de Negócio: Registrar consumo, abater estoque e checar alertas
    public async registrarConsumo(dados: {
        quantidade_usada: number;
        observacoes?: string;
        id_cuidador: number;
        id_animal: number;
        id_suprimento: number;
    }) {

        // PASSO 1 - Busca o suprimento no banco
        const suprimento = await this.suprimentoRepository.buscarPorId(dados.id_suprimento);

        if (!suprimento) {
            throw new Error('Suprimento não encontrado.');
        }
        if (!suprimento.ativo) {
            throw new Error('Não é possível utilizar um suprimento inativo.');
        }
        if (suprimento.quantidade_estoque < dados.quantidade_usada) {
            throw new Error(`Estoque insuficiente. Quantidade disponível: ${suprimento.quantidade_estoque}`);
        }

        // PASSO 2 - Instancia o novo registro de uso (Sem o pseudo-ID)
        const novoRegistro = new RegistroUso(
            new Date(),
            dados.quantidade_usada,
            dados.id_cuidador,
            dados.id_animal,
            dados.id_suprimento,
            dados.observacoes || ''
        );

        // PASSO 3 - Abate o estoque usando a própria classe de domínio
        suprimento.quantidade_estoque = suprimento.quantidade_estoque - dados.quantidade_usada;

        // PASSO 4 - Persiste as alterações no banco de dados e captura o Registro com ID
        // * Nota técnica: No ambiente de produção do Node.js puro com 'pg', o ideal 
        // é envelopar essas duas chamadas num bloco de transação SQL (BEGIN/COMMIT).
        const registroSalvo = await this.registroUsoRepository.salvar(novoRegistro);
        await this.suprimentoRepository.atualizar(suprimento);

        // PASSO 5 - Regra de Negócio (Opcional, mas crucial): Gerar alerta se o estoque ficou baixo
        if (suprimento.precisaReposicao()) {

            if (!suprimento.id_suprimento) {
                throw new Error('Erro ao gerar alerta: ID do suprimento não identificado.');
            }

            const alerta = new AlertaEstoque(
                new Date(),
                `Estoque baixo: ${suprimento.nome}. Nível atual: ${suprimento.quantidade_estoque} ${suprimento.unidade}.`,
                suprimento.id_suprimento,
                StatusAlerta.ATIVO
            );
            await this.alertaEstoqueRepository.salvar(alerta);
        }

        return registroSalvo; // Retorna o registro com o ID definitivo gerado pelo banco
    }

    public async listarHistoricoPorAnimal(id_animal: number) {
        return this.registroUsoRepository.buscarPorAnimal(id_animal);
    }

    public async listarHistoricoPorSuprimento(id_suprimento: number) {
        return this.registroUsoRepository.buscarPorSuprimento(id_suprimento);
    }
}