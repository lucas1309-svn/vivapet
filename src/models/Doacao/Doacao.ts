import { ItemDoacao } from './ItemDoacao';

export class Doacao {


  private readonly _id: string;
  private _dataDoacao: Date;
  private _observacoes: string;
  private _doadorId: string;
  private _itens: ItemDoacao[];


  constructor(id: string, dataDoacao: Date, doadorId: string, itens: ItemDoacao[], observacoes: string = '') {
    this._id = id;
    this._dataDoacao = dataDoacao;
    this._doadorId = doadorId;
    this._itens = itens;
    this._observacoes = observacoes;
  }


  public get id() {
    return this._id;
  }
  

  public get dataDoacao() {
    return this._dataDoacao;
  }

  public set dataDoacao(dataDoacao: Date) {
    this._dataDoacao = dataDoacao;
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get doadorId() {
    return this._doadorId;
  }

  public set doadorId(doadorId: string) {
    this._doadorId = doadorId;
  }


  public get itens() {
    return this._itens;
  }

  public set itens(itens: ItemDoacao[]) {
    this._itens = itens;
  }
}