// src/routes/redirectRoutes.js
import express from "express";
import { redirectLink } from "../controllers/linkController.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Redirecionamento
 *   description: Rota pública para acessar links encurtados
 */

/**
 * @swagger
 * /{shortId}:
 *   get:
 *     summary: Redireciona para a URL original a partir do shortId
 *     tags: [Redirecionamento]
 *     parameters:
 *       - in: path
 *         name: shortId
 *         required: true
 *         schema:
 *           type: string
 *         description: O código encurtado do link
 *     responses:
 *       302:
 *         description: Redireciona para a URL original
 *       404:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * Rota de redirecionamento (pública).
 *
 * Fluxo:
 * 1. Usuário acessa /:shortId (sem autenticação)
 * 2. Logger registra o acesso
 * 3. Controller busca no banco e redireciona para a URL original
 * 4. Caso não exista → retorna 404
 */

router.get("/:shortId", async (req, res) => {
    logger.info(`[redirectRoutes] GET /${req.params.shortId} chamado`);
    try {
        await redirectLink(req, res);
    } catch (err) {
        logger.error(
            `[redirectRoutes] Erro em GET /${req.params.shortId}: ${err.message}`
        );
        res.status(500).json({ error: "Erro interno ao redirecionar link" });
    }
});

export default router;