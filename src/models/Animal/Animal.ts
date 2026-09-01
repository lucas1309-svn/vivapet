import { SexoAnimal, StatusAnimal, TipoAnimal } from "../Enums/Enums";
import { Necessidade } from "../Necessidade/Necessidade";

export class Animal {


  private readonly _id_animal: number;
  private _nome: string;
  private _tipo: TipoAnimal;
  private _raca: string;
  private _sexo: SexoAnimal;
  private _data_nascimento: Date;
  private _data_entrada_abrigo: Date;
  private _observacoes: string;
  private _status: StatusAnimal;
  private _necessidades: Necessidade[];


  constructor(id_animal: number, nome: string, tipo: TipoAnimal, raca: string, sexo: SexoAnimal, data_nascimento: Date, data_entrada_abrigo: Date, observacoes: string = '', status: StatusAnimal = StatusAnimal.ATIVO, necessidades: Necessidade[] = []) {
    this._id_animal = id_animal;
    this._nome = nome;
    this._tipo = tipo;
    this._raca = raca;
    this._sexo = sexo;
    this._data_nascimento = data_nascimento;
    this._data_entrada_abrigo = data_entrada_abrigo;
    this._observacoes = observacoes;
    this._status = status;
    this._necessidades = necessidades;
  }


  public get id_animal() {
    return this._id_animal;
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

  
  public get data_nascimento() {
    return this._data_nascimento;
  }

  public set data_nascimento(data_nascimento: Date) {
    this._data_nascimento = data_nascimento;
  }

  
  public get data_entrada_abrigo() {
    return this._data_entrada_abrigo;
  }
  
  public set data_entrada_abrigo(data_entrada_abrigo: Date) {
    this._data_entrada_abrigo = data_entrada_abrigo;
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
    let idade = hoje.getFullYear() - this._data_nascimento.getFullYear();
    const mes = hoje.getMonth() - this._data_nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < this._data_nascimento.getDate())) {
      idade--;
    }
    return idade;
  }
}