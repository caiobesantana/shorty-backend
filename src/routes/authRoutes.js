import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rota protegida de teste
router.get("/me", authMiddleware, (req, res) => {
     res.json({ message: "Acesso autorizado", userId: req.user.id });
});

export default router;
