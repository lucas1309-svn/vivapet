export class Necessidade {


  private readonly _id: string;
  private _descricao: string;
  private _observacoes: string;
  private _ativa: boolean;


  constructor(id: string, descricao: string, observacoes: string = '', ativa: boolean = true) {
    this._id = id;
    this._descricao = descricao;
    this._observacoes = observacoes;
    this._ativa = ativa;
  }


  public get id() {
    return this._id;
  }


  public get descricao() {
    return this._descricao;
  }

  public set descricao(descricao: string) {
    this._descricao = descricao;
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get ativa() {
    return this._ativa;
  }

  public set ativa(ativa: boolean) {
    this._ativa = ativa;
  }
}