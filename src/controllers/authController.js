// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Função de registro
export async function register(req, res) {
     try {
          const { name, email, password } = req.body;

          if (!name || !email || !password) {
               return res.status(400).json({ error: "Preencha todos os campos" });
          }

          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({ error: "E-mail já cadastrado" });
          }

          // A senha será hashada pelo middleware 'pre-save' do modelo User.js
          const user = await User.create({ name, email, password }); // <-- Salva no campo 'password'

          const token = jwt.sign(
               { id: user._id },
               process.env.JWT_SECRET || "defaultsecret",
               { expiresIn: "7d" }
          );

          res.status(201).json({
               message: "Usuário registrado com sucesso",
               user: { id: user._id, name: user.name, email: user.email },
               token
          });
     } catch (err) {
          console.error("[auth] Erro no registro:", err);
          res.status(500).json({ error: "Erro no servidor" });
     }
}

// Função de login
export async function login(req, res) {
     try {
          const { email, password } = req.body;

          const user = await User.findOne({ email });
          if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

          console.log("[login] senha enviada:", password);
          console.log("[login] senha no banco:", user.password); // <--- Acessa user.password

          const isMatch = await bcrypt.compare(password, user.password); // <--- Compara com user.password
          console.log("[login] resultado do compare:", isMatch);

          if (!isMatch) return res.status(400).json({ error: "Senha inválida" });

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "defaultsecret", {
               expiresIn: "1d",
          });

          res.json({
               message: "Login bem-sucedido",
               user: { id: user._id, name: user.name, email: user.email },
               token,
          });
     } catch (err) {
          console.error("[auth/login]", err);
          res.status(500).json({ error: "Erro ao fazer login" });
     }
}