import jwt from "jsonwebtoken";


export const verificarToken = (request, response, next) => {
    const token = request.headers.authorization?.split(" ")[1];
        if (!token) return response.status(401).json({ message: "Token não fornecido" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return response.status(403).json({ message: "Token inválido" });

    request.user = decoded; 
    next();
    });
}