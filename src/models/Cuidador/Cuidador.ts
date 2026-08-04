
import { Animal } from "../Animal/Animal"
import { TipoCuidador } from "../Enums/Enums"
import { RegistroUso } from "../RegistroUso.ts/RegistroUso"

export class Cuidador{

 private readonly _id: string
 private _nome: string
 private _tipo: TipoCuidador
 private readonly _cpf: string
 private _email: string
 private readonly _dataCadastro: Date
 private _ativo: boolean

 private _animais: Animal[]

 constructor(id: string, nome: string, tipo: TipoCuidador, cpf: string, email: string, dataCadastro: Date, ativo: boolean){

    this._id = id;
    this._nome = nome;
    this._tipo = tipo
    this._cpf = cpf;
    this._email = email;
    this._dataCadastro = dataCadastro;
    this._ativo = ativo

    this._animais = []

 }




 public get id(){
    return this._id
 }

 public get nome(){
    return this._nome
 }

 public get tipo(){
    return this._tipo
 } 

 public get cpf(){
    return this._cpf
 }

 public get email(){
    return this._email
 }

 public get dataCadastro(){
    return this._dataCadastro
 }


 public get ativo(){
    return this._ativo
 }


 public set nome(nome:string){
    this._nome = nome
 }

 public set tipo(tipo: TipoCuidador){
    this._tipo = tipo
 }


public set email(email:string){
    this._email = email
}

public set ativo(ativo: boolean){
    this._ativo = ativo

}



// ADICIONAR ANIMAL AO CUIDADOR:
public adicionarAnimal(animal: Animal){

    if(this._animais.length >= 10){
        console.log('Limite excedido! ')
        console.log('Um cuidador pode cuidar no máximo 10 animais. ')

    } else{
        this._animais.push(animal)
    }
}

public listarAnimais(){
    return this._animais
}


/*
public registrarUso(id: string, dataUso: Date, quantidadeUsada: number, observacoes: string, cuidador: Cuidador, animal: Animal){
    
    const novoRegistro = new RegistroUso(id, dataUso, quantidadeUsada, observacoes, this, animal)
}
*/


}