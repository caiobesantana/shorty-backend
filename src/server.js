// src/server.js
import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import logger from "./utils/logger.js"; // <-- import do logger

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Inicialização do servidor
 * Fluxo:
 * 1. Conecta ao MongoDB
 * 2. Conta usuários para teste
 * 3. Sobe servidor Express
 */
(async () => {
     try {
          await connectDB(MONGODB_URI);

          // Loga quantos usuários existem no banco
          const usersCount = await User.countDocuments();
          logger.info(`[db] Usuários existentes: ${usersCount}`);

          app.listen(PORT, () => {
               logger.info(`[server] Rodando em http://localhost:${PORT}`);
          });
     } catch (err) {
          logger.error(`[server] Falha ao iniciar: ${err.message}`);
          process.exit(1);
     }
})();
