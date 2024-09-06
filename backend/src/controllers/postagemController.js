import {request, response} from "express"
import Postagem from "../models/postagemModel.js"
import { z } from "zod"
import formatZodError from "../helpers/zodError.js"

const createSchema = z.object({
    titulo: z.string().min(3, {message: "A postagem deve ter pelo menos 3 caracteres"}).transform((txt)=>txt.toLowerCase()) ,
    conteudo: z.string().min(3, {message: "O conteudo deve ter pelo menos 3 caracteres"}),
    autor: z.string().min(3, {message: "O autor deve ter pelo menos 3 caracteres"}),
})

const getSchema = z.object({
    id: z.string().uuid({message: "Id inválido"})
})

const updatePostagemSchema = z.object({
    titulo: z.string().min(3, {message: "A postagem deve ter pelo menos 3 caracteres"}).transform((txt)=>txt.toLowerCase()) ,
    conteudo: z.string().min(3, {message: "O conteudo deve ter pelo menos 3 caracteres"}),
    autor: z.string().min(3, {message: "O autor deve ter pelo menos 3 caracteres"}),
})

//PUXAR TODAS AS POSTAGENS
export const getAll = async (request, response) => {
    const page = parseInt(request.query.page) || 1
    const limit = parseInt(request.query.limit) || 10
    const offset = (page - 1) * limit

    try {
        const postagens = await Postagem.findAndCountAll({
            limit,
            offset
        })
        //console.log(postagens)
        //console.log(page, limit, offset)
        const totalPaginas = Math.ceil(postagens.count/ limit)
        response.status(200).json({
            totalPostagens:postagens.count,
            totalPaginas,
            paginaAtual: page,
            itemsPorPagina: limit,
            proximaPagina: totalPaginas === 0 ? null : `http://localhost:3333/postagens?page=${page + 1}`,
            postagens: postagens.rows
        })
    } catch (error) {
        response.status(500).json({message: "Erro ao buscar postagens"})
    }
}

//CRIAR UMA NOVA POSTAGEM
export const create = async (request, response)=> {
    
    //implementar a validação 
    const bodyValidation = createSchema.safeParse(request.body)
    if(!bodyValidation.success){
        response.status(400).json({
            message: "Os dados recebidos do corpo da requisição são invalidos",
            detalhes: formatZodError(bodyValidation.error)
        })
        return
    }
    

    const {titulo, conteudo, autor, imagem}= request.body

    const novaPostagem = {
        titulo,
        conteudo,
        autor,
        imagem
    }

    try {
        await Postagem.create(novaPostagem)
        response.status(201).json({message:"Postagem Cadastrada"})
    } catch (error) {
        console.error(error)
        response.status(500).json({message:"Erro ao cadastrar postagem"})
    }
}

//PUXAR POSTAGEM POR ID
export const getPostagem = async(request, response) => {
    const paramValidator = getSchema.safeParse(request.params)
    if(! paramValidator.success){
        response.status(400).json({
            message: "Número de identificação está invalido",
            detalhes: formatZodError(paramValidator.error)
        })
        return
    }
    const {id} = request.params

    try {
        const postagem = await Postagem.findByPk(id)
        if(postagem === null){
            response.status(404).json({message: "postagem não encontrada"})
            return
        }
        response.status(200).json(postagem)
    } catch (error) {
        response.status(500).json({message: "Erro ao buscar postagem"})
    }
}

//ATUALIZAR POSTAGEM
export const updatePostagem = async(request, response) => {
    const paramValidator = getSchema.safeParse(request.params)
    if(! paramValidator.success){
        response.status(400).json({
            message: "Número de identificação está invalido",
            detalhes: formatZodError(paramValidator.error)
        })
        return
    }

    const updateValidator = updatePostagemSchema.safeParse(request.body)
    if(!updateValidator.success){
        response.status(400).json({
            message: "Dados para atualização estão incorretos",
            details: formatZodError(updateValidator.error)
        })
        return
    }
    
    const {id} = request.params
    const {titulo, conteudo, autor, imagem} = request.body

    const postagemAtualizada ={
        titulo,
        conteudo,
        autor,
        imagem
    }

    try {
        const[linhasAfetadas]= await Postagem.update(postagemAtualizada, {where: {id}})

        if(linhasAfetadas <= 0){
            response.status(404).json({message: "Postagem não encontrada"})
            return
        }
        response.status(200).json({message: "Postagem atualizada com sucesso"})
    } catch (error) {
        response.status(500).json({message: "Erro ao atualizar postagem"})
    }
}

export const deletePostagem = async(request, response) => {
    const paramValidator = getSchema.safeParse(request.params)
    if(! paramValidator.success){
        response.status(400).json({
            message: "Número de identificação está invalido",
            detalhes: formatZodError(paramValidator.error)
        })
        return
    }
    const {id} = request.params

    try {
        const postagem = await Postagem.destroy({where: { id }})
        if(postagem === null){
            response.status(404).json({message: "postagem não encontrada"})
            return
        }
        response.status(200).json({message: "Postagem deletada com sucesso"})
    } catch (error) {
        response.status(500).json({message: "Erro ao buscar postagem"})
    }
}