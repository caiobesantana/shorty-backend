// src/routes/authRoutes.js
import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/authController.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import logger from "../utils/logger.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação (públicas)
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Caio
 *               email:
 *                 type: string
 *                 example: caio@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação ou email já cadastrado
 *       500:
 *         description: Erro interno no servidor
 */
router.post(
     "/register",
     [
          body("name")
               .notEmpty().withMessage("Nome é obrigatório")
               .isLength({ min: 3 }).withMessage("Nome deve ter pelo menos 3 caracteres"),
          body("email")
               .notEmpty().withMessage("Email é obrigatório")
               .isEmail().withMessage("Formato de email inválido"),
          body("password")
               .notEmpty().withMessage("Senha é obrigatória")
               .isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
     ],
     validateRequest,
     async (req, res) => {
          logger.info(`[authRoutes] POST /api/auth/register chamado`);
          try {
               await register(req, res);
          } catch (err) {
               logger.error(`[authRoutes] Erro em POST /api/auth/register: ${err.message}`);
               res.status(500).json({ error: "Erro interno ao registrar usuário" });
          }
     }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: caio@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido (retorna token JWT)
 *       400:
 *         description: Usuário não encontrado ou senha inválida
 *       500:
 *         description: Erro interno no servidor
 */
router.post(
     "/login",
     [
          body("email")
               .notEmpty().withMessage("Email é obrigatório")
               .isEmail().withMessage("Formato de email inválido"),
          body("password")
               .notEmpty().withMessage("Senha é obrigatória")
               .isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres"),
     ],
     validateRequest,
     async (req, res) => {
          logger.info(`[authRoutes] POST /api/auth/login chamado`);
          try {
               await login(req, res);
          } catch (err) {
               logger.error(`[authRoutes] Erro em POST /api/auth/login: ${err.message}`);
               res.status(500).json({ error: "Erro interno ao fazer login" });
          }
     }
);

export default router;
