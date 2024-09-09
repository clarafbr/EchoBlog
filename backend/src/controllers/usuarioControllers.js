import { request, response } from "express"
import Usuario from "../models/usuarioModel.js"
import { z } from "zod"
import formatZodError from "../helpers/zodError.js"


//Validações com o zod
const createSchema = z.object({
    nome: z.string().min(3, {message: "O nome deve ter pelo menos 3 caracteres"}).transform((txt)=>txt.toLowerCase()) ,
    email: z.string().min(10, {message: "O email deve ter pelo menos 10 caracteres"}),
    senha: z.string().min(5, {message: "A senha deve ter pelo menos 5 caracteres"}),
    papel: z.enum(["leitor", "administrador", "autor"])
})
const updateUsuarioSchema = z.object({
    nome: z.string().min(3, {message: "O nome deve ter pelo menos 3 caracteres"}).transform((txt)=>txt.toLowerCase()) ,
    email: z.string().min(10, {message: "O email deve ter pelo menos 10 caracteres"}),
    senha: z.string().min(5, {message: "A senha deve ter pelo menos 5 caracteres"}),
    papel: z.enum(["leitor", "administrador", "autor"])
})
const buscarUsuarioPorFiltroSchema = z.object({
    filtro: z.string().min(3, {message: "O nome deve ter pelo menos 3 caracteres"}).transform((txt)=>txt.toLowerCase()) ,
})

export const create = async (request, response) => {
    
    //implementar a validação 
    const bodyValidation = createSchema.safeParse(request.body)
    if(!bodyValidation.success){
        response.status(400).json({
            message: "Os dados recebidos do corpo da requisição são invalidos",
            detalhes: formatZodError(bodyValidation.error)
        })
        return
    }
    

    const {nome, email, senha}= request.body
    const papel = "leitor"

    const novoUsuario = {
        nome,
        email,
        senha,
        papel
    }

    try {
        await Usuario.create(novoUsuario)
        response.status(201).json({message:"Usuário registrado com sucesso!"})
    } catch (error) {
        console.error(error)
        response.status(500).json({message:"Erro ao registrar usuário"})
    }
}

export const login = async (request, response) => {

}

export const updateUsuario = async(request, response) => {
    const paramValidator = getSchema.safeParse(request.params)
    if(! paramValidator.success){
        response.status(400).json({
            message: "Número de identificação está invalido",
            detalhes: formatZodError(paramValidator.error)
        })
        return
    }

    const updateValidator = updateUsuarioSchema.safeParse(request.body)
    if(!updateValidator.success){
        response.status(400).json({
            message: "Dados para atualização estão incorretos",
            details: formatZodError(updateValidator.error)
        })
        return
    }
    
    const {id} = request.params
    const {nome, email, senha, papel} = request.body

    const UsuarioAtualizado ={
        nome,
        email,
        senha,
        papel
    }

    try {
        const[linhasAfetadas]= await Usuario.update(UsuarioAtualizado, {where: {id}})

        if(linhasAfetadas <= 0){
            response.status(404).json({message: "Usuário não encontrado"})
            return
        }
        response.status(200).json({message: "Usuario atualizado com sucesso"})
    } catch (error) {
        response.status(500).json({message: "Erro ao atualizar usuário"})
    }
}

export const getUsuarioPorFiltro = async(request, response) => {
    const filtroValidation = buscarUsuarioPorFiltroSchema.safeParse(request.params)
    if(!filtroValidation.success){
        response.status(400).json({
            message: "Inválido",
            details: formatZodError(filtroValidation.error)
        })
        return
    }
    
    const {filtro} = request.params
    try {
        const usuarios = await Usuario.findAll({
            where: {papel: filtro} || {nome: filtro} || {email: filtro},
            raw: true,
        })

        response.status(200).json(usuarios)
    } catch (error) {
        response.status(500).json({err: "Erro ao buscar usuarios"})
    }
}

export const deleteUsuario = async(request, response) => {

}

export const updatePapel = async(request, response) => {

}



