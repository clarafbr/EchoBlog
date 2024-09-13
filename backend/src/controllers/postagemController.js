import Postagem from "../models/postagemModel.js"
import { Usuario } from "../models/usuarioModel.js"
import { z } from "zod"
import formatZodError from "../helpers/zodError.js"

const createSchema = z.object({
    titulo: z.string().min(3, {message: "A postagem deve ter pelo menos 3 caracteres"}),
    conteudo: z.string().min(3, {message: "O conteudo deve ter pelo menos 3 caracteres"}),
    usuarioId: z.string().min(1, { message: "O ID do usuário é obrigatório" }),
    imagem: z.string().optional(),
})

const updatePostagemSchema = z.object({
    titulo: z.string().min(3, {message: "A postagem deve ter pelo menos 3 caracteres"}).optional(),
    conteudo: z.string().min(3, {message: "O conteudo deve ter pelo menos 3 caracteres"}).optional(),
    imagem: z.string().url({ message: "A URL da imagem deve ser válida" }).optional(),
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
    

    const {titulo, conteudo, usuarioId, imagem}= request.body

    const novaPostagem = {
        titulo,
        conteudo,
        usuarioId,
        imagem
    }

    try {
        await Postagem.create(novaPostagem)
        response.status(201).json({message:"Postagem realizada com sucesso!"})
    } catch (error) {
        console.error(error)
        response.status(500).json({message:"Erro ao realizar postagem"})
    }
}

//PUXAR POSTAGEM POR ID
export const getPostagemId = async(request, response) => {
    try {
        const { id } = idSchema.parse(request.params);
    
        const postagem = await Postagem.findByPk(id);
    
        if (!postagem) {
            return response.status(404).json({ error: "Postagem não encontrada" });
        }
    
        response.status(200).json(postagem);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({
            errors: error.errors.map((err) => ({
                path: err.path,
                message: err.message,
            })),
        });
        }
        console.error(error);
        response.status(500).json({ error: "Erro ao buscar a postagem" });
    }
}

//ATUALIZAR POSTAGEM
export const updatePostagem = async(request, response) => {
    try {
        const { id } = idSchema.parse(request.params);
        const { titulo, conteudo, imagem } = updatePostagemSchema.parse(request.body);
    
        const postagem = await Postagem.findByPk(id);
    
        if (!postagem) {
            return response.status(404).json({ error: "Postagem não encontrada" });
        }
    
        postagem.titulo = titulo || postagem.titulo;
        postagem.conteudo = conteudo || postagem.conteudo;
        postagem.imagem = imagem || postagem.imagem;
    
        await postagem.save();
    
        response.status(200).json(postagem);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({
            errors: error.errors.map((err) => ({
                path: err.path,
                message: err.message,
            })),
        });
        }
        console.error(error);
        response.status(500).json({ error: "Erro ao atualizar a postagem" });
    }
}

//DELETAR POSTAGEM
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

export const uploadImagem = async(request, response) =>{
    try {
        const { id } = idSchema.parse(request.params);
    
        if (!request.file) {
            return response.status(400).json({ error: "Imagem não enviada" });
        }
    
        const postagem = await Postagem.findByPk(id);
    
        if (!postagem) {
            return response.status(404).json({ error: "Postagem não encontrada" });
        }
    
        postagem.imagem = `/uploads/images/${request.file.filename}`;
        await postagem.save();
    
        response.status(200).json({ message: "Imagem enviada com sucesso", imagem: postagem.imagem });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({
            errors: error.errors.map((err) => ({
                path: err.path,
                message: err.message,
            })),
        });
        }
        console.error(error);
        response.status(500).json({ error: "Erro ao enviar a imagem" });
    }
}

export const listarPostagemPorAutor = async(request, response) =>{
    try {
        const { autor } = request.query;
    
        const filtro = {};
        if (autor) {
            filtro.usuarioId = autor;
        }
    
        const postagens = await Postagem.findAll({ where: filtro });
    
        response.status(200).json(postagens);
    } catch (error) {
        response.status(500).json({ message: "Erro ao listar postagens", error: error.message });
    }
}