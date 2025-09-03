// src/middlewares/validateRequest.js
import { validationResult } from "express-validator";
import logger from "../utils/logger.js";

/**
 * Middleware que processa os resultados das validações
 * feitas com express-validator.
 *
 * Fluxo:
 * 1. Rota chama validadores (ex.: check("email").isEmail())
 * 2. Esse middleware coleta os erros
 * 3. Se houver erros → retorna 400 com lista de mensagens
 * 4. Caso contrário → segue para o próximo handler
 */
export function validateRequest(req, res, next) {
     const errors = validationResult(req);

     if (!errors.isEmpty()) {
          logger.warn(`[validateRequest] Erros de validação: ${JSON.stringify(errors.array())}`);
          return res.status(400).json({
               error: "Erro de validação",
               details: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg,
               })),
          });
     }

     next();
}
