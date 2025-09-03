import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) { 
     const authHeader = req.headers["authorization"];
     if (!authHeader) {
          return res.status(401).json({ error: "Token não fornecido" });
     }

     // Espera no formato: "Bearer <token>"
     const [, token] = authHeader.split(" ");
     if (!token) {
          
          return res.status(401).json({ error: "Token inválido", token });
     }

     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
          req.user = { id: decoded.id }; // Agora req.user.id = id do usuário
          next();
     } catch (err) {
          return res.status(401).json({ error: "Token expirado ou inválido" });
     }
}
