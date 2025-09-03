import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createLink, getMyLinks, updateLink, deleteLink } from "../controllers/linkController.js";

const router = Router();

// Criar link
router.post("/", authMiddleware, createLink);

// Listar links
router.get("/", authMiddleware, getMyLinks);

// Atualizar link
router.put("/:id", authMiddleware, updateLink);

// Deletar link
router.delete("/:id", authMiddleware, deleteLink);

export default router