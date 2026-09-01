export class ItemDoacao {


  private readonly _id_item_doacao: number;
  private _quantidade: number;
  private _data_validade: Date;
  private _observacoes: string;
  private _id_suprimento: number;


  constructor(id_item_doacao: number, quantidade: number, data_validade: Date, id_suprimento: number, observacoes: string = '') {
    this._id_item_doacao = id_item_doacao;
    this._quantidade = Math.floor(quantidade);
    this._data_validade = data_validade;
    this._id_suprimento = id_suprimento;
    this._observacoes = observacoes;
  }


  public get id_item_doacao() {
    return this._id_item_doacao;
  }
  

  public get quantidade() {
    return this._quantidade;
  }

  public set quantidade(quantidade: number) { 
    this._quantidade = Math.floor(quantidade); 
  }


  public get data_validade() {
    return this._data_validade;
  }

  public set data_validade(data_validade: Date) {
    this._data_validade = data_validade;
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get id_suprimento() {
    return this._id_suprimento;
  }

  public set id_suprimento(id_suprimento: number) {
    this._id_suprimento = id_suprimento;
  }
  
}