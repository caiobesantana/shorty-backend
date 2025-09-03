// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

/**
 * Middleware de autenticação JWT
 *
 * Fluxo:
 * 1. Lê o header Authorization → deve vir no formato "Bearer <token>"
 * 2. Valida o token usando JWT_SECRET do .env
 * 3. Se válido → adiciona req.user com os dados do payload
 * 4. Caso contrário → responde 401 (não autorizado)
 *
 * Este middleware é usado nas rotas protegidas (links, por exemplo).
 */
export function authMiddleware(req, res, next) {
     try {
          const authHeader = req.headers["authorization"];

          // Verifica se o header foi enviado
          if (!authHeader) {
               logger.warn("[authMiddleware] Nenhum token enviado");
               return res.status(401).json({ error: "Token não fornecido" });
          }

          // Espera receber no formato "Bearer token"
          const token = authHeader.split(" ")[1];
          if (!token) {
               logger.warn("[authMiddleware] Formato do token inválido");
               return res.status(401).json({ error: "Formato do token inválido" });
          }

          // Valida o token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Guarda os dados do usuário no request para usar nos controllers
          req.user = { id: decoded.id };

          logger.info(`[authMiddleware] Token válido para usuário ${decoded.id}`);

          next();
     } catch (err) {
          logger.error(`[authMiddleware] Erro na autenticação: ${err.message}`);
          return res.status(401).json({ error: "Token inválido ou expirado" });
     }
}
