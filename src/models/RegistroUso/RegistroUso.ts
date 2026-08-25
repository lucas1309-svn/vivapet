export class RegistroUso {


  private readonly _id: string;
  private _dataUso: Date;
  private _quantidadeUsada: number;
  private _observacoes: string;
  private _cuidadorId: string;
  private _animalId: string;
  private _suprimentoId: string;


  constructor(id: string, dataUso: Date, quantidadeUsada: number, cuidadorId: string, animalId: string, suprimentoId: string, observacoes: string = '') {
    this._id = id;
    this._dataUso = dataUso;
    this._quantidadeUsada = Math.floor(quantidadeUsada);
    this._cuidadorId = cuidadorId;
    this._animalId = animalId;
    this._suprimentoId = suprimentoId;
    this._observacoes = observacoes;
  }


  public get id() {
    return this._id;
  }
  

  public get dataUso() {
    return this._dataUso;
  }

  public set dataUso(dataUso: Date) {
    this._dataUso = dataUso;
  }


  public get quantidadeUsada() {
    return this._quantidadeUsada;
  }

  public set quantidadeUsada(quantidadeUsada: number) { 
    this._quantidadeUsada = Math.floor(quantidadeUsada); 
  }


  public get observacoes() {
    return this._observacoes;
  }

  public set observacoes(observacoes: string) {
    this._observacoes = observacoes;
  }


  public get cuidadorId() {
    return this._cuidadorId;
  }

  public set cuidadorId(cuidadorId: string) {
    this._cuidadorId = cuidadorId;
  }


  public get animalId() {
    return this._animalId;
  }

  public set animalId(animalId: string) {
    this._animalId = animalId;
  }


  public get suprimentoId() {
    return this._suprimentoId;
  }

  public set suprimentoId(suprimentoId: string) {
    this._suprimentoId = suprimentoId;
  }
}