import { SexoAnimal, StatusAnimal, TipoAnimal } from "../Enums/Enums";
import { Necessidade } from "../Necessidade/Necessidade";


export class Animal {


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


  constructor(id: string, nome: string, tipo: TipoAnimal, raca: string, sexo: SexoAnimal, dataNascimento: Date, dataEntradaAbrigo: Date, observacoes: string = '',     status: StatusAnimal = StatusAnimal.ATIVO, necessidades: Necessidade[] = []) {
    this._id = id;
    this._nome = nome;
    this._tipo = tipo;
    this._raca = raca;
    this._sexo = sexo;
    this._dataNascimento = dataNascimento;
    this._dataEntradaAbrigo = dataEntradaAbrigo;
    this._observacoes = observacoes;
    this._status = status;
    this._necessidades = necessidades;
  }


  public get id() {
    return this._id;
  }
  
  
  public get nome() {
    return this._nome;
  }

  public set nome(nome: string) {
    this._nome = nome;
  }


  public get tipo() {
    return this._tipo;
  }

  public set tipo(tipo: TipoAnimal) {
    this._tipo = tipo;
  }


  public get raca() {
    return this._raca;
  }
  
  public set raca(raca: string) {
    this._raca = raca;
  }


  public get sexo() {
    return this._sexo;
  }

  public set sexo(sexo: SexoAnimal) {
    this._sexo = sexo;
  }

  
  public get dataNascimento() {
    return this._dataNascimento;
  }

  public set dataNascimento(dataNascimento: Date) {
    this._dataNascimento = dataNascimento;
  }

  
  public get dataEntradaAbrigo() {
    return this._dataEntradaAbrigo;
  }
  
  public set dataEntradaAbrigo(dataEntradaAbrigo: Date) {
    this._dataEntradaAbrigo = dataEntradaAbrigo;
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get status() {
    return this._status;
  }
  
  public set status(status: StatusAnimal) {
    this._status = status;
  }

  
  public get necessidades() {
    return this._necessidades;
  }
  
  public set necessidades(necessidades: Necessidade[]) {
    this._necessidades = necessidades;
  }



  // Métodos de Negócio
  public calcularIdade() {
    const hoje = new Date();
    let idade = hoje.getFullYear() - this._dataNascimento.getFullYear();
    const mes = hoje.getMonth() - this._dataNascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < this._dataNascimento.getDate())) {
      idade--;
    }
    return idade;
  }
}