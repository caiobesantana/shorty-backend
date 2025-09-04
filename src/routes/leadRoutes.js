// src/routes/leadRoutes.js
import express from "express";
import { body } from "express-validator";
import { createLead } from "../controllers/leadController.js";
import logger from "../utils/logger.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Captura de leads pelas landing pages
 */

/**
 * @swagger
 * /api/leads:
 *   post:
 *     summary: Captura um lead da página de captura
 *     tags: [Leads]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shortId
 *               - name
 *               - phone
 *             properties:
 *               shortId:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: João Silva
 *               phone:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       201:
 *         description: Lead criado com sucesso (retorna redirectTo)
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Link não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

router.post(
     "/",
     [
          body("shortId").notEmpty().withMessage("shortId é obrigatório"),
          body("name")
               .notEmpty().withMessage("Nome é obrigatório")
               .isLength({ min: 2 }).withMessage("Nome deve ter pelo menos 2 caracteres"),
          body("phone")
               .notEmpty().withMessage("Telefone é obrigatório")
               .isLength({ min: 10 }).withMessage("Telefone deve ter pelo menos 10 dígitos"),
     ],
     validateRequest, // <-- adicione isto
     async (req, res) => {
          logger.info(`[leadRoutes] POST /api/leads chamado para shortId ${req.body.shortId}`);
          try {
               await createLead(req, res);
          } catch (err) {
               logger.error(`[leadRoutes] Erro em POST /api/leads: ${err.message}`);
               res.status(500).json({ error: "Erro interno ao salvar lead" });
          }
     }
);


export default router;
