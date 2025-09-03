// src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";

const app = express();

// Middlewares globais
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
 
// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

// Rota pública (deve ser a última, para não conflitar)
app.use("/", redirectRoutes);
 
// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes); // 👈 adiciona isso

// Rotas
app.use("/api/auth", authRoutes);

// Rota fallback (404)
app.use((req, res) => {
     res.status(404).json({ error: "Not found" });
});

export default app;