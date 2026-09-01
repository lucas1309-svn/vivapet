import { Animal } from "../Animal/Animal";


export class Cuidador {


  private readonly _id_cuidador: number;
  private _nome: string;
  private _cpf: string;
  private _email: string;
  private _data_cadastro: Date;
  private _ativo: boolean;
  private _animais_sob_responsabilidade: Animal[];


  constructor(id_cuidador: number, nome: string, cpf: string, email: string, data_cadastro: Date = new Date(), ativo: boolean = true) {
    this._id_cuidador = id_cuidador;
    this._nome = nome;
    this._cpf = cpf;
    this._email = email;
    this._data_cadastro = data_cadastro;
    this._ativo = ativo;
    this._animais_sob_responsabilidade = [];
  }


  public get id_cuidador() {
    return this._id_cuidador;
  }


  public get nome() {
    return this._nome;
  }

  public set nome(nome: string) {
    this._nome = nome;
  }


  public get cpf() {
    return this._cpf;
  }

  public set cpf(cpf: string) {
    this._cpf = cpf;
  }


  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }


  public get data_cadastro() {
    return this._data_cadastro;
  }

  public set data_cadastro(data_cadastro: Date) {
    this._data_cadastro = data_cadastro;
  }


  public get ativo() {
    return this._ativo;
  }

  public set ativo(ativo: boolean) {
    this._ativo = ativo;
  }


  public get animais_sob_responsabilidade() {
    return this._animais_sob_responsabilidade;
  }

  public set animais_sob_responsabilidade(animais: Animal[]) {
    this._animais_sob_responsabilidade = animais;
  }



  // Métodos de Negócio
  public quantidade_animais() {

    return this._animais_sob_responsabilidade.length;
  }


  public adicionarAnimal(animal: Animal) {

    if (this.quantidade_animais() >= 10) {
      throw new Error('Um cuidador não pode ser responsável por mais de 10 animais.');
    }

    this._animais_sob_responsabilidade.push(animal);
  }
}