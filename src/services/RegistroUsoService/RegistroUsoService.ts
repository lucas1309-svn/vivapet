import { AlertaEstoqueRepository } from "@/repositories/AlertaEstoqueRepository/AlertaEstoqueRepository";
import { RegistroUsoRepository } from "@/repositories/RegistroUsoRepository/RegistroUsoRepository";
import { SuprimentoRepository } from "@/repositories/SuprimentoRepository/SuprimentoRepository";

export class RegistroUsoService{

    private registroUsoRepository: RegistroUsoRepository;
    private suprimentoRepository: SuprimentoRepository;
    public alertaEstoqueRepository: AlertaEstoqueRepository;

    constructor(){
        this.registroUsoRepository = new RegistroUsoRepository()
        this.suprimentoRepository = new SuprimentoRepository()
        this.alertaEstoqueRepository = new AlertaEstoqueRepository()
    }

    public async listarHistoricoPorAnimal(id_animal: number){
        return this.registroUsoRepository.buscarPorAnimal(id_animal)
    }

    public async listarHistoricoPorSuprimento(id_suprimento: number){
        return this.registroUsoRepository.buscarPorSuprimento(id_suprimento)
    }
}
