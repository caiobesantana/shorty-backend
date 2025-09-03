 
// src/controllers/linkController.js
import Link from "../models/Link.js";
import { customAlphabet } from "nanoid";
import logger from "../utils/logger.js"; // <-- logger central

// Gerador de shortId com 4 caracteres (a-z0-9)
const generateShortId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

/**
 * Controller: createLink
 * Chamado em POST /api/links
 * Fluxo: gera shortId único → salva no banco → retorna link criado
 */ 
export async function createLink(req, res) {
     try {
          const { originalUrl } = req.body;
          if (!originalUrl) {
               return res.status(400).json({ error: "URL original é obrigatória" });
          }

          let shortId;
          let existing;

          // tenta gerar até encontrar um shortId único
          do {
               shortId = generateShortId();
               existing = await Link.findOne({ shortId });
          } while (existing);

          // regra de negócio: evitar duplicação de URL para o mesmo usuário
          const duplicate = await Link.findOne({ originalUrl, userId: req.user.id });
          if (duplicate) {
               return res.status(400).json({ error: "Este link já foi encurtado por você" });
          }

          const link = await Link.create({
               shortId,
               originalUrl,
               userId: req.user.id,
          });

          const baseUrl = `${req.protocol}://${req.get("host")}`;

          res.status(201).json({
               message: "Link criado com sucesso",
               link: {
                    id: link._id,
                    shortId: link.shortId,
                    originalUrl: link.originalUrl,
                    shortUrl: `${baseUrl}/${link.shortId}`, // 🚀 novo campo
               },
          });
     } catch (err) {
          console.error("[links/create]", err);
          res.status(500).json({ error: "Erro ao criar link" });
     }
}
 
/**
 * Controller: getMyLinks
 * Chamado em GET /api/links
 * Fluxo: retorna todos os links do usuário logado
 */ 
// Listar links do usuário logado
export async function getMyLinks(req, res) {
     try {
          const baseUrl = `${req.protocol}://${req.get("host")}`;

          const links = await Link.find({ userId: req.user.id }).sort({ createdAt: -1 });

          res.json({
               count: links.length,
               links: links.map(link => ({
                    id: link._id,
                    shortId: link.shortId,
                    originalUrl: link.originalUrl,
                    shortUrl: `${baseUrl}/${link.shortId}`, // 🚀 novo campo
                    createdAt: link.createdAt
               }))
          });
     } catch (err) {
          console.error("[links/getMyLinks]", err);
          res.status(500).json({ error: "Erro ao buscar links" });
     }
}
 
/**
 * Controller: updateLink
 * Chamado em PUT /api/links/:id
 * Fluxo: busca link pelo shortId + userId → atualiza originalUrl
 */ 
export async function updateLink(req, res) {
     try {
          const { id } = req.params; // shortId
          const { originalUrl } = req.body;

          const link = await Link.findOne({ shortId: id, userId: req.user.id });
          if (!link) {
               return res.status(404).json({ error: "Link não encontrado ou não pertence a você" });
          }

          link.originalUrl = originalUrl || link.originalUrl;
          await link.save();

          const baseUrl = `${req.protocol}://${req.get("host")}`;

          res.json({
               message: "Link atualizado com sucesso",
               link: {
                    id: link._id,
                    shortId: link.shortId,
                    originalUrl: link.originalUrl,
                    shortUrl: `${baseUrl}/${link.shortId}`, // 🚀 novo campo
               }
          });
     } catch (err) {
          console.error("[links/update]", err);
          res.status(500).json({ error: "Erro ao atualizar link" });
     }
} 

/**
 * Controller: deleteLink
 * Chamado em DELETE /api/links/:id
 * Fluxo: busca link pelo shortId + userId → remove do banco
 */
export async function deleteLink(req, res) {
     try {
          const { id } = req.params;

          const link = await Link.findOneAndDelete({ shortId: id, userId: req.user.id });
          if (!link) {
               logger.warn(`[links/delete] Link não encontrado: ${id}`);
               return res
                    .status(404)
                    .json({ error: "Link não encontrado ou não pertence a você" });
          }

          logger.info(`[links/delete] Link excluído: ${id}`);

          res.json({ message: "Link excluído com sucesso" });
     } catch (err) {
          logger.error(`[links/delete] Erro: ${err.message}`);
          res.status(500).json({ error: "Erro ao excluir link" });
     }
}

/**
 * Controller: redirectLink (público)
 * Chamado em GET /:shortId
 * Fluxo: busca shortId → redireciona para originalUrl
 */
export async function redirectLink(req, res) {
     try {
          const { shortId } = req.params;

          const link = await Link.findOne({ shortId });
          if (!link) {
               logger.warn(`[links/redirect] Link não encontrado: ${shortId}`);
               return res.status(404).json({ error: "Link não encontrado" });
          }

          logger.info(`[links/redirect] Redirecionando shortId ${shortId} → ${link.originalUrl}`);
          return res.redirect(link.originalUrl);
     } catch (err) {
          logger.error(`[links/redirect] Erro: ${err.message}`);
          res.status(500).json({ error: "Erro ao redirecionar link" });
     }
}