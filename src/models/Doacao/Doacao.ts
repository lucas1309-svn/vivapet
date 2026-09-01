import { ItemDoacao } from "../ItemDoacao/ItemDoacao";


export class Doacao {


  private readonly _id_doacao: number;
  private _data_doacao: Date;
  private _observacoes: string;
  private _id_doador: number;
  private _itens: ItemDoacao[];


  constructor(id_doacao: number, data_doacao: Date, id_doador: number, itens: ItemDoacao[], observacoes: string = '') {
    this._id_doacao = id_doacao;
    this._data_doacao = data_doacao;
    this._id_doador = id_doador;
    this._itens = itens;
    this._observacoes = observacoes;
  }


  public get id() {
    return this._id_doacao;
  }
  

  public get data_doacao() {
    return this._data_doacao;
  }

  public set data_doacao(data_doacao: Date) {
    this._data_doacao = data_doacao;
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get id_doador() {
    return this._id_doador;
  }

  public set id_doador(id_doador: number) {
    this._id_doador = id_doador;
  }


  public get itens() {
    return this._itens;
  }

  public set itens(itens: ItemDoacao[]) {
    this._itens = itens;
  }
}