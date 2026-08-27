export class Suprimento {


  private readonly _id_suprimento: number;
  private _nome: string;
  private _unidade: string;
  private _quantidade_estoque: number;
  private _quantidade_minima: number;
  private _data_cadastro: Date;
  private _ativo: boolean;


  constructor(id_suprimento: number, nome: string, unidade: string, quantidade_estoque: number, quantidade_minima: number, data_cadastro: Date = new Date(), ativo: boolean = true) {
    this._id_suprimento = id_suprimento;
    this._nome = nome;
    this._unidade = unidade;
    this._quantidade_estoque = Math.floor(quantidade_estoque);
    this._quantidade_minima = Math.floor(quantidade_minima);
    this._data_cadastro = data_cadastro;
    this._ativo = ativo;
  }


  public get id_suprimento() {
    return this._id_suprimento;
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


  public get quantidade_estoque() {
    return this._quantidade_estoque;
  }

  public set quantidade_estoque(quantidade_estoque: number) { 
    this._quantidade_estoque = Math.floor(quantidade_estoque); 
  }


  public get quantidade_minima() {
    return this._quantidade_minima;
  }

  public set quantidade_minima(quantidade_minima: number) { 
    this._quantidade_minima = Math.floor(quantidade_minima); 
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



  // Métodos de Negócio
  public nivelEstoque() {
    return this._quantidade_estoque;
  }

  public precisaReposicao(): boolean {
    return this._quantidade_estoque < this._quantidade_minima;
  }
}