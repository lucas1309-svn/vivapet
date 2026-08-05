import { Animal } from "../Animal/Animal";
import { Cuidador } from "../Cuidador/Cuidador";

export class RegistroUso{

    private readonly _id: string;
    private readonly _dataUso: Date;
    private readonly _quantidadeUsada: number;
    private readonly _observacoes: string;

    private readonly _cuidador: Cuidador;
    private readonly _animal: Animal;

    constructor(id: string, dataUso: Date, quantidadeUsada: number, observacoes: string, cuidador: Cuidador, animal: Animal){

        this._id = id;
        this._dataUso = dataUso;
        this._quantidadeUsada = quantidadeUsada;
        this._observacoes = observacoes;
        this._cuidador = cuidador;
        this._animal = animal
    }


    public get id(){
        return this._id
    }

    public get dataUso(){
        return this._dataUso
    }

    public get quantidadeUsada(){
        return this._quantidadeUsada
    }

    public get observacoes(){
        return this._observacoes
    }

    public get cuidador(){
        return this._cuidador
    }

    public get animal(){
        return this._animal
    }
}