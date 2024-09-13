import Usuario from "../models/usuarioModel.js"
import bcrypt from "bcrypt";
import { z } from "zod"
import jwt from "jsonwebtoken";


//Validações com o zod
const createUserSchema = z.object({
    nome: z.string().min(3, {message: "O nome deve ter pelo menos 3 caracteres"}),
    email: z.string().email({message: "Email inválido!"}),
    senha: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres"}),
    papel: z.enum(["leitor", "administrador", "autor"]).optional()
})
const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido!"}),
    senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})
const updateUsuarioSchema = z.object({
    nome: z.string().min(3, {message: "O nome deve ter pelo menos 3 caracteres"}).optional(),
    email: z.string().email({message: "Email inválido!"}).optional(),
    senha: z.string().min(6, {message: "A senha deve ter pelo menos 6 caracteres"}).optional(),
})
const papelSchema = z.object({
    papel: z.enum(["administrador", "autor", "leitor"], { message: "Papel inválido" }),
}) 

export const create = async (request, response)=> {

    try {
        const { nome, email, senha, papel } = createUserSchema.parse(request.body);
        const hashedSenha = await bcrypt.hash(senha, 10);
    
        const definirPapel = papel ? papel : "leitor";
    
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: hashedSenha,
            papel: definirPapel,
        });
    
        response.status(201).json({ message: "Usuário registrado com sucesso", usuario: novoUsuario });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
}

export const login = async (request, response) => {
    try {
        const { email, senha } = loginSchema.parse(request.body);
    
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({message: "Usuário não encontrado"});
        }
    
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({message: "Senha incorreta"});
        }
    
        const token = jwt.sign({ id: usuario.id, papel: usuario.papel }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
        response.status(200).json({message: "Login realizado com sucesso!", token});
    } catch (error) {
        response.status(400).json({error: error.message});
    }
}

export const updateUsuario = async(request, response) => {
    try {
        const { id } = request.params;
        const { nome, email, senha } = updateUsuarioSchema.parse(request.body);
    
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return response.status(404).json({message: "Usuário não encontrado"});
        }
    
        usuario.nome = nome || usuario.nome;
        usuario.email = email || usuario.email;
    
        if (senha) {
            usuario.senha = await bcrypt.hash(senha, 10);
        }
    
        await usuario.save();
    
        response.status(200).json({message: "Usuário atualizado com sucesso!", usuario});
    } catch (error) {
        response.status(400).json({error: error.message});
    }
}

export const getUsuarioPorFiltro = async(request, response) => {
    try {
        const usuarios = await Usuario.findAll();
    
        response.status(200).json(usuarios);
    } catch (error) {
        response.status(500).json({message: "Erro ao listar usuários", error: error.message});
    }
}

export const deleteUsuario = async(request, response) => {
    try {
        const { id } = request.params;
    
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({message: "Usuário não encontrado"});
        }
    
        await usuario.destroy();
    
        response.status(200).json({message: "Usuário excluído com sucesso!"});
    } catch (error) {
        response.status(500).json({error: "Erro ao excluir usuário", details: error.message});
    }
}

export const updatePapel = async(request, response) => {
    try {
        const { id } = request.params; 
        const { papel } = papelSchema.parse(request.body); 
    
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return response.status(404).json({message: "Usuário não encontrado"});
        }
    
        usuario.papel = papel;
        await usuario.save();
    
        response.status(200).json({message: "Papel do usuário atualizado com sucesso!", usuario});
    } catch (error) {
        response.status(400).json({error: error.message});
    }
}



