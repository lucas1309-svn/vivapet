export class RegistroUso {


  private readonly _id_registro_uso: number;
  private _data_uso: Date;
  private _quantidade_usada: number;
  private _observacoes: string;
  private _id_cuidador: number;
  private _id_animal: number;
  private _id_suprimento: number;


  constructor(id_registro_uso: number, data_uso: Date, quantidade_usada: number, id_cuidador: number, id_animal: number, id_suprimento: number, observacoes: string = '') {
    this._id_registro_uso = id_registro_uso;
    this._data_uso = data_uso;
    this._quantidade_usada = Math.floor(quantidade_usada);
    this._id_cuidador = id_cuidador;
    this._id_animal = id_animal;
    this._id_suprimento = id_suprimento;
    this._observacoes = observacoes;
  }


  public get id_registro_uso() {
    return this._id_registro_uso;
  }
  

  public get data_uso() {
    return this._data_uso;
  }

  public set data_uso(data_uso: Date) {
    this._data_uso = data_uso;
  }


  public get quantidade_usada() {
    return this._quantidade_usada;
  }

  public set quantidade_usada(quantidade_usada: number) { 
    this._quantidade_usada = Math.floor(quantidade_usada); 
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get id_cuidador() {
    return this._id_cuidador;
  }

  public set id_cuidador(id_cuidador: number) {
    this._id_cuidador = id_cuidador;
  }


  public get id_animal() {
    return this._id_animal;
  }

  public set id_animal(id_animal: number) {
    this._id_animal = id_animal;
  }


  public get id_suprimento() {
    return this._id_suprimento;
  }

  public set id_suprimento(id_suprimento: number) {
    this._id_suprimento = id_suprimento;
  }

}