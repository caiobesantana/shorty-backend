import { Router } from "express";
import Link from "../models/Link.js";

const router = Router();

// Rota pública: redirecionar para URL original
router.get("/:shortId", async (req, res) => {
     try {
          const { shortId } = req.params;
          const link = await Link.findOne({ shortId });

          if (!link) {
               return res.status(404).json({ error: "Link não encontrado" });
          }

          return res.redirect(link.originalUrl);
     } catch (err) {
          console.error("[redirect]", err);
          res.status(500).json({ error: "Erro no redirecionamento" });
     }
});

export default router;