import { TipoNecessidade } from "../Enums/Enums";

export class Necessidade {

    private readonly _id: string;
    private _tipo: TipoNecessidade;
    private _descricao: string;
    private _observacoes: string;
    

    constructor(id: string, tipo: TipoNecessidade, descricao: string, observacoes: string,){

        this._id = id;
        this._tipo = tipo;
        this._descricao = descricao;
        this._observacoes = observacoes;
       
    }


    public get id(){
        return this._id
    }

    public get tipo(){
        return this._tipo
    }

    public get descricao(){
        return this._descricao
    }

    public get observacoes(){
        return this._observacoes
    }

    public set tipo(tipo: TipoNecessidade){
        this._tipo = tipo
    }

    public set descricao(descricao: string){
        this._descricao = descricao
    }

    public set observacoes(observacoes: string){
        this._observacoes = observacoes
    }




        
}