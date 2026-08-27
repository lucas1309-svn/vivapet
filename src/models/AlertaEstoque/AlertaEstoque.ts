import { StatusAlerta } from "../Enums/Enums";


export class AlertaEstoque {


  private readonly _id_alerta_estoque: number;
  private _data_alerta: Date;
  private _mensagem: string;
  private _status: StatusAlerta;
  private _id_suprimento: number;


  constructor(id_alerta_estoque: number, data_alerta: Date, mensagem: string, id_suprimento: number, status: StatusAlerta = StatusAlerta.ATIVO) {
    this._id_alerta_estoque = id_alerta_estoque;
    this._data_alerta = data_alerta;
    this._mensagem = mensagem;
    this._id_suprimento = id_suprimento;
    this._status = status;
  }


  public get id_alerta_estoque() {
    return this._id_alerta_estoque;
  }
 

  public get data_alerta() {
    return this._data_alerta;
  }

  public set data_alerta(data_alerta: Date) {
    this._data_alerta = data_alerta;
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


  public get id_suprimento() {
    return this._id_suprimento;
  }
  
  public set id_suprimento(id_suprimento: number) {
    this._id_suprimento = id_suprimento;
  }



  // Métodos de Negócio
  public marcarComoResolvido() {
    this._status = StatusAlerta.RESOLVIDO;
  }
  
}