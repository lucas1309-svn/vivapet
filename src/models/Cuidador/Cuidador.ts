import { Animal } from './Animal';

export class Cuidador {


  private readonly _id: string;
  private _nome: string;
  private _cpf: string;
  private _telefone: string;
  private _email: string;
  private _dataCadastro: Date;
  private _ativo: boolean;
  private _animaisSobResponsabilidade: Animal[];


  constructor(id: string, nome: string, cpf: string, telefone: string, email: string, dataCadastro: Date = new Date(), ativo: boolean = true) {
    this._id = id;
    this._nome = nome;
    this._cpf = cpf;
    this._telefone = telefone;
    this._email = email;
    this._dataCadastro = dataCadastro;
    this._ativo = ativo;
    this._animaisSobResponsabilidade = [];
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


  public get cpf() {
    return this._cpf;
  }

  public set cpf(cpf: string) {
    this._cpf = cpf;
  }


  public get telefone() {
    return this._telefone;
  }

  public set telefone(telefone: string) {
    this._telefone = telefone;
  }


  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }


  public get dataCadastro() {
    return this._dataCadastro;
  }

  public set dataCadastro(dataCadastro: Date) {
    this._dataCadastro = dataCadastro;
  }


  public get ativo() {
    return this._ativo;
  }

  public set ativo(ativo: boolean) {
    this._ativo = ativo;
  }


  public get animaisSobResponsabilidade() {
    return this._animaisSobResponsabilidade;
  }

  public set animaisSobResponsabilidade(animais: Animal[]) {
    this._animaisSobResponsabilidade = animais;
  }



  // Métodos de Negócio
  public quantidadeAnimais() {
    
    return this._animaisSobResponsabilidade.length;
  }


  public adicionarAnimal(animal: Animal) {

    if (this.quantidadeAnimais() >= 10) {
      throw new Error('Um cuidador não pode ser responsável por mais de 10 animais.');
    }

    this._animaisSobResponsabilidade.push(animal);
  }
}