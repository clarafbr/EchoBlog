import jwt from 'jsonwebtoken';

const verificarPapelAdmin = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({ message: "Token não fornecido" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.papel !== 'administrador') {
            return response.status(403).json({ message: "Acesso não autorizado" });
        }
        request.user = decoded;
        next();
    } catch (error) {
        return response.status(401).json({ message: "Token inválido" });
    }
};

export default verificarPapelAdmin