import { Router } from "express";
import authRoutes from "./auth.js";

const router = Router();

router.get("/", (req, res) => {
     res.json({ message: "API up" });
});

// rotas de autenticação
router.use("/auth", authRoutes);

export default router;
