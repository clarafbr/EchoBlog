import {request, response} from "express"
import Postagem from "../models/postagemModel.js"
import { z } from "zod"

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
