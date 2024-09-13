import  Usuario  from "../usuarioModel.js";
import Postagem  from "../postagemModel.js";

Usuario.hasMany(Postagem, { foreignKey: 'usuarioId', as: 'postagens' });
Postagem.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuarios' });