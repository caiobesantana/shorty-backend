// src/utils/logger.js
import { createLogger, format, transports } from "winston";

/**
 * Winston logger central da aplicação
 * Níveis:
 * - info: operações normais
 * - warn: algo inesperado, mas não quebra
 * - error: erros graves
 *
 * Todos os logs recebem timestamp automaticamente.
 */
const logger = createLogger({
     level: "info",
     format: format.combine(
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf(({ level, message, timestamp }) => {
               return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
          })
     ),
     transports: [
          new transports.Console(), // logs no terminal
          new transports.File({ filename: "logs/error.log", level: "error" }),
          new transports.File({ filename: "logs/combined.log" }),
     ],
});

export default logger;
