import { StatusAlerta } from './enums'; // Ajuste o caminho

export class AlertaEstoque {


  private readonly _id: string;
  private _dataAlerta: Date;
  private _mensagem: string;
  private _status: StatusAlerta;
  private _suprimentoId: string;


  constructor(id: string, dataAlerta: Date, mensagem: string, suprimentoId: string, status: StatusAlerta = StatusAlerta.ATIVO) {
    this._id = id;
    this._dataAlerta = dataAlerta;
    this._mensagem = mensagem;
    this._suprimentoId = suprimentoId;
    this._status = status;
  }


  public get id() {
    return this._id;
  }
 

  public get dataAlerta() {
    return this._dataAlerta;
  }

  public set dataAlerta(dataAlerta: Date) {
    this._dataAlerta = dataAlerta;
  }


  public get mensagem() {
    return this._mensagem;
  }

  public set mensagem(mensagem: string) {
    this._mensagem = mensagem;
  }


  public get status() {
    return this._status;
  }
  
  public set status(status: StatusAlerta) {
    this._status = status;
  }


  public get suprimentoId() {
    return this._suprimentoId;
  }
  
  public set suprimentoId(suprimentoId: string) {
    this._suprimentoId = suprimentoId;
  }



  // Métodos de Negócio
  public marcarComoResolvido() {
    this._status = StatusAlerta.RESOLVIDO;
  }
  
}