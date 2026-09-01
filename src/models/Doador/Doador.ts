export class Doador {


  private readonly _id_doador: number;
  private _nome: string;
  private _cpf: string;
  private _email: string;


  constructor(id_doador: number, nome: string, cpf: string, email: string) {
    this._id_doador = id_doador;
    this._nome = nome;
    this._cpf = cpf;
    this._email = email;
  }


  public get id_doador() {
    return this._id_doador;
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

}