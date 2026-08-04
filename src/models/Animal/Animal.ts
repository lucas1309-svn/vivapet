import { SexoAnimal, StatusAnimal, TipoAnimal } from "../Enums/Enums";
import { Necessidade } from "../Necessidade/Necessidade";

export class Animal{

    private readonly _id: string;
    private _nome: string;
    private _tipo: TipoAnimal;
    private _raca: string;
    private _sexo: SexoAnimal;
    private _dataNascimento: Date;
    private _dataEntradaAbrigo: Date;
    private _observacoes: string;
    private _status: StatusAnimal;

    private _necessidades: Necessidade[];


    constructor(id: string, nome: string, tipo: TipoAnimal, raca: string, sexo: SexoAnimal, dataNascimento: Date, dataEntradaAbrigo: Date, observacoes: string, status: StatusAnimal){

        this._id = id;
        this._nome = nome;
        this._tipo = tipo;
        this._raca = raca;
        this._sexo = sexo;
        this._dataNascimento = dataNascimento;
        this._dataEntradaAbrigo = dataEntradaAbrigo;
        this._observacoes = observacoes;
        this._status = status

        this._necessidades = [];
    }



    public get id(){
        return this._id
    }


    public get nome(){
        return this._nome
    }

    public get tipo(){
        return this._tipo
}

public get raca(){
        return this._raca

}

public get sexo(){
        return this._sexo

}

public get dataNascimento(){

    return this._dataNascimento
}

public get dataEntradaAbrigo(){
        return this._dataEntradaAbrigo

}

public get observacoes(){
        return this._observacoes

}

public get status(){
        return this._status

}



public set nome(nome: string){
    this._nome = nome
}


public set tipo(tipo: TipoAnimal){
    this._tipo = tipo
}

public set raca(raca: string){
    this._raca = raca
}

public set sexo(sexo: SexoAnimal){
    this._sexo = sexo
}

public set dataNascimento(dataNascimento: Date){
    this._dataNascimento = dataNascimento
}

public set dataEntradaAbrigo(dataEntradaAbrigo: Date){
    this._dataEntradaAbrigo = dataEntradaAbrigo
}

public set observacoes(observacoes: string){
    this._observacoes = observacoes
}

public set status(status: StatusAnimal){
    this._status = status
}



// CALCULAR IDADE DO ANIMAL

public calcularIdade(){

    // RETORNA A DATA COMPLETA DE HOJE
    const hoje = new Date(); 

    // PEGA O ANO DA DATA DE HOJE E SUBTRAI PELO ANO DA DATA DE ANIVERSARIO
    let idade = hoje.getFullYear() - this.dataNascimento.getFullYear();

    /* CHECANDO O MES E O DIA DO ANIVERSARIO DO ANIMAL
    * SE O MES, A DATA DE HOJE FOR MENOR DO QUE O MES DE NASCIMENTO DO ANIMAL, JA RETORNA VERDADEIRO
    * OU
    *SE O MES NA DATA DE HOJE FOR IGUAL AO MES DE NASCIMENTO DO ANIMAL CHECA-SE O DIA
    */
    const aniversarioNaoOcorrido = hoje.getMonth() < this._dataNascimento.getMonth() || (
        hoje.getMonth() === this._dataNascimento.getMonth() && hoje.getDate() < this._dataNascimento.getDate()
    )

    if(aniversarioNaoOcorrido){
        idade --;
}
return idade


}


// ADICIONAR NECESSIDADES DO ANIMAL

public adicionarNecessidade(necessidade: Necessidade){
    this._necessidades.push(necessidade)
}

}