export class Doador {


  private readonly _id: string;
  private _nome: string;
  private _cpf: string;
  private _telefone: string;
  private _email: string;
  private _endereco: string;


  constructor(id: string, nome: string, cpf: string, telefone: string, email: string, endereco: string) {
    this._id = id;
    this._nome = nome;
    this._cpf = cpf;
    this._telefone = telefone;
    this._email = email;
    this._endereco = endereco;
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


  public get endereco() {
    return this._endereco;
  }

  public set endereco(endereco: string) {
    this._endereco = endereco;
  }
}