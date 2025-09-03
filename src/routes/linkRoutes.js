// src/routes/linkRoutes.js
import express from "express";
import { body } from "express-validator";
import {
     createLink,
     getMyLinks,
     updateLink,
     deleteLink,
} from "../controllers/linkController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import logger from "../utils/logger.js";

/**
 * @swagger
 * tags:
 *   name: Links
 *   description: Gerenciamento de links encurtados
 */

const router = express.Router();

/**
 * Rotas de gerenciamento de links (privadas).
 *
 * Agora com validação dos dados:
 * - Criar link → originalUrl obrigatório e válido
 * - Atualizar link → originalUrl, se enviado, deve ser válido
 */

/**
 * @swagger
 * /api/links:
 *   post:
 *     summary: Criar um novo link encurtado
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://google.com
 *     responses:
 *       201:
 *         description: Link criado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno no servidor
 */
router.post(
     "/",
     authMiddleware,
     [
          body("originalUrl")
               .notEmpty().withMessage("A URL original é obrigatória")
               .isURL().withMessage("A URL informada não é válida"),
     ],
     validateRequest,
     async (req, res) => {
          logger.info(`[linkRoutes] POST /api/links chamado pelo usuário ${req.user?.id}`);
          try {
               await createLink(req, res);
          } catch (err) {
               logger.error(`[linkRoutes] Erro em POST /api/links: ${err.message}`);
               res.status(500).json({ error: "Erro interno ao criar link" });
          }
     }
);

/**
 * @swagger
 * /api/links:
 *   get:
 *     summary: Listar links do usuário logado
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de links do usuário
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/", authMiddleware, async (req, res) => {
     logger.info(`[linkRoutes] GET /api/links chamado pelo usuário ${req.user?.id}`);
     try {
          await getMyLinks(req, res);
     } catch (err) {
          logger.error(`[linkRoutes] Erro em GET /api/links: ${err.message}`);
          res.status(500).json({ error: "Erro interno ao buscar links" });
     }
});

/**
 * @swagger
 * /api/links/{id}:
 *   put:
 *     summary: Atualizar um link pelo shortId
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: shortId do link
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 example: https://youtube.com
 *     responses:
 *       200:
 *         description: Link atualizado com sucesso
 *       404:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put(
     "/:id",
     authMiddleware,
     [
          body("originalUrl")
               .optional()
               .isURL().withMessage("Se enviada, a URL deve ser válida"),
     ],
     validateRequest,
     async (req, res) => {
          logger.info(
               `[linkRoutes] PUT /api/links/${req.params.id} chamado pelo usuário ${req.user?.id}`
          );
          try {
               await updateLink(req, res);
          } catch (err) {
               logger.error(`[linkRoutes] Erro em PUT /api/links/${req.params.id}: ${err.message}`);
               res.status(500).json({ error: "Erro interno ao atualizar link" });
          }
     }
);

/**
 * @swagger
 * /api/links/{id}:
 *   delete:
 *     summary: Deletar um link pelo shortId
 *     tags: [Links]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: shortId do link
 *     responses:
 *       200:
 *         description: Link excluído com sucesso
 *       404:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete("/:id", authMiddleware, async (req, res) => {
     logger.info(
          `[linkRoutes] DELETE /api/links/${req.params.id} chamado pelo usuário ${req.user?.id}`
     );
     try {
          await deleteLink(req, res);
     } catch (err) {
          logger.error(`[linkRoutes] Erro em DELETE /api/links/${req.params.id}: ${err.message}`);
          res.status(500).json({ error: "Erro interno ao excluir link" });
     }
});

export default router;
