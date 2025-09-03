// src/app.js
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import logger from "./utils/logger.js";

// Swagger
import { swaggerSpec, swaggerUi } from "./config/swagger.js";

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logs HTTP com morgan, redirecionados para winston
app.use(
     morgan("tiny", {
          stream: {
               write: (message) => logger.info(message.trim()),
          },
     })
);

// Rotas principais
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", redirectRoutes);

// Middleware de rota não encontrada
app.use((req, res, next) => {
     logger.warn(`[404] Rota não encontrada: ${req.method} ${req.originalUrl}`);
     res.status(404).json({ error: "Rota não encontrada" });
});

// Middleware de erro global
app.use((err, req, res, next) => {
     logger.error(`[500] ${err.message}`);
     res.status(500).json({ error: "Erro interno no servidor" });
});

export default app;
