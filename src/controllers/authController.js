// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

/**
 * Controller: Registro de usuário
 *
 * Fluxo:
 * 1. Recebe name, email, password do body (já validados pelo middleware)
 * 2. Verifica se email já existe
 * 3. Hash da senha com bcrypt
 * 4. Salva usuário no banco
 * 5. Retorna usuário (sem senha) + token JWT
 */
export async function register(req, res) {
     try {
          const { name, email, password } = req.body;

          // Verifica se já existe usuário
          const existing = await User.findOne({ email });
          if (existing) {
               logger.warn(`[auth/register] Email já registrado: ${email}`);
               return res.status(400).json({ error: "Email já registrado" });
          }

          // Gera hash seguro da senha
          const hashedPassword = await bcrypt.hash(password, 10);

          // Cria usuário
          // Cria usuário (sem hashear aqui, o hook vai cuidar)
          const user = await User.create({
               name,
               email,
               password, 
          });


          // Cria token JWT
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
               expiresIn: "1d",
          });

          logger.info(`[auth/register] Usuário criado: ${user._id}`);

          res.status(201).json({
               message: "Usuário registrado com sucesso",
               user: { id: user._id, name: user.name, email: user.email },
               token,
          });
     } catch (err) {
          logger.error(`[auth/register] Erro: ${err.message}`);
          res.status(500).json({ error: "Erro interno ao registrar usuário" });
     }
}

/**
 * Controller: Login de usuário
 *
 * Fluxo:
 * 1. Recebe email e password do body (já validados pelo middleware)
 * 2. Verifica se usuário existe
 * 3. Compara senha enviada com hash do banco
 * 4. Retorna usuário (sem senha) + token JWT
 */
export async function login(req, res) {
     try {
          

          const { email, password } = req.body;

          // Verifica usuário
          const user = await User.findOne({ email });
          console.log("🔍 Buscando usuário:", email, user);
          if (!user) {
               logger.warn(`[auth/login] Usuário não encontrado: ${email}`);
               return res.status(400).json({ error: "Usuário não encontrado" });
          }

          // Compara senha enviada com a armazenada
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
               logger.warn(`[auth/login] Senha inválida para usuário ${email}`);
               return res.status(400).json({ error: "Senha inválida" });
          }

          // Gera novo token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
               expiresIn: "1d",
          });

          logger.info(`[auth/login] Login bem-sucedido: ${user._id}`);

          res.json({
               message: "Login bem-sucedido",
               user: { id: user._id, name: user.name, email: user.email },
               token,
          });
     } catch (err) {
          logger.error(`[auth/login] Erro: ${err.message}`);
          res.status(500).json({ error: "Erro interno ao fazer login" });
     }
}
