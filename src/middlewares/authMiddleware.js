import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Encabezado de autorización recibido:', authHeader); // Verifica el encabezado

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Cabecera de autorización no encontrada o mal formada");
        return res.status(401).json({ message: "No autenticado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("Token decodificado:", decoded); // Verifica el contenido del token
        req.user = decoded; // Adjunta la información del usuario a req.user
        next();
    } catch (error) {
        console.log("Error al verificar el token:", error.message);
        return res.status(401).json({ message: "Token inválido" });
    }
};

export default authMiddleware;