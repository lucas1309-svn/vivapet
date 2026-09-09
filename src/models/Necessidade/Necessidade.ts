export class Necessidade {


  private readonly _id_necessidade?: number;
  private _descricao: string;
  private _observacoes: string;
  private _ativa: boolean;


  constructor(descricao: string, observacoes: string = '', ativa: boolean = true, id_necessidade?: number) {
    this._descricao = descricao;
    this._observacoes = observacoes;
    this._ativa = ativa;
    this._id_necessidade = id_necessidade;
  }


  public get id_necessidade() {
    return this._id_necessidade;
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