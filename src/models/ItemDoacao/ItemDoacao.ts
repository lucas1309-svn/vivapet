export class ItemDoacao {


  private readonly _id: string;
  private _quantidade: number;
  private _dataValidade: Date;
  private _observacoes: string;
  private _suprimentoId: string;


  constructor(id: string, quantidade: number, dataValidade: Date, suprimentoId: string, observacoes: string = '') {
    this._id = id;
    this._quantidade = Math.floor(quantidade);
    this._dataValidade = dataValidade;
    this._suprimentoId = suprimentoId;
    this._observacoes = observacoes;
  }


  public get id() {
    return this._id;
  }
  

  public get quantidade() {
    return this._quantidade;
  }

  public set quantidade(quantidade: number) { 
    this._quantidade = Math.floor(quantidade); 
  }


  public get dataValidade() {
    return this._dataValidade;
  }

  public set dataValidade(dataValidade: Date) {
    this._dataValidade = dataValidade;
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get suprimentoId() {
    return this._suprimentoId;
  }

  public set suprimentoId(suprimentoId: string) {
    this._suprimentoId = suprimentoId;
  }
}