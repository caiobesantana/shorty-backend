// src/routes/redirectRoutes.js
import express from "express";
import Link from "../models/Link.js";
import logger from "../utils/logger.js";

const router = express.Router();

router.get("/:shortId", async (req, res) => {
    const { shortId } = req.params;
    logger.info(`[redirectRoutes] GET /${shortId} chamado`);

    try {
        const link = await Link.findOne({ shortId });

        if (!link) {
            logger.warn(`[redirectRoutes] Link não encontrado: ${shortId}`);
            return res.status(404).send(`
        <html>
          <head><title>Link não encontrado</title></head>
          <body style="font-family: sans-serif; text-align: center; padding: 40px;">
            <h1>404 - Link não encontrado</h1>
            <p>Este link não existe ou foi removido.</p>
          </body>
        </html>
      `);
        }

        // Renderizar a landing page de captura
        return res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${link.title || "Saiba mais"}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; text-align: center; background: #f9f9f9; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px; margin-top: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            h1 { margin-bottom: 10px; }
            p { margin-bottom: 20px; color: #555; }
            img { max-width: 100%; border-radius: 12px; margin-bottom: 20px; }
            input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; }
            button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
            button:disabled { background: #999; cursor: not-allowed; }
            .error { color: red; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            ${link.bannerUrl ? `<img src="${link.bannerUrl}" alt="Banner" />` : ""}
            <h1>${link.title || "Saiba mais"}</h1>
            <p>${link.description || "Preencha seus dados para continuar"}</p>
            
            <form id="leadForm">
              <input type="text" name="name" placeholder="Seu nome" required minlength="2" />
              <input type="tel" name="phone" placeholder="WhatsApp" required minlength="10" />
              <input type="hidden" name="shortId" value="${link.shortId}" />
              <button type="submit">Quero saber mais</button>
              <div id="error" class="error"></div>
            </form>
          </div>

          <script src="/static/lead.js"></script>
        </body>
      </html>
    `);
    } catch (err) {
        logger.error(`[redirectRoutes] Erro em GET /${shortId}: ${err.message}`);
        return res.status(500).send("Erro interno no servidor");
    }
});

export default router;
