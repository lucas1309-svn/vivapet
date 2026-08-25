export class Suprimento {


  private readonly _id: string;
  private _nome: string;
  private _unidade: string;
  private _quantidadeEstoque: number;
  private _quantidadeMinima: number;
  private _dataCadastro: Date;
  private _ativo: boolean;


  constructor(id: string, nome: string, unidade: string, quantidadeEstoque: number, quantidadeMinima: number, dataCadastro: Date = new Date(), ativo: boolean = true) {
    this._id = id;
    this._nome = nome;
    this._unidade = unidade;
    this._quantidadeEstoque = Math.floor(quantidadeEstoque);
    this._quantidadeMinima = Math.floor(quantidadeMinima);
    this._dataCadastro = dataCadastro;
    this._ativo = ativo;
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


  public get unidade() {
    return this._unidade;
  }

  public set unidade(unidade: string) {
    this._unidade = unidade;
  }


  public get quantidadeEstoque() {
    return this._quantidadeEstoque;
  }

  public set quantidadeEstoque(quantidadeEstoque: number) { 
    this._quantidadeEstoque = Math.floor(quantidadeEstoque); 
  }


  public get quantidadeMinima() {
    return this._quantidadeMinima;
  }

  public set quantidadeMinima(quantidadeMinima: number) { 
    this._quantidadeMinima = Math.floor(quantidadeMinima); 
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



  // Métodos de Negócio
  public nivelEstoque() {
    return this._quantidadeEstoque;
  }

  public precisaReposicao(): boolean {
    return this._quantidadeEstoque < this._quantidadeMinima;
  }
}