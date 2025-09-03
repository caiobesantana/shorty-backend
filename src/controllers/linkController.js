import Link from "../models/Link.js";
import { customAlphabet } from "nanoid";

const generateShortId = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 4);

// Criar link
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

          const link = await Link.create({
               shortId,
               originalUrl,
               userId: req.user.id,
          });

          res.status(201).json({
               message: "Link criado com sucesso",
               link: {
                    id: link._id,
                    shortId: link.shortId,
                    originalUrl: link.originalUrl,
               },
          });
     } catch (err) {
          console.error("[links/create]", err);
          res.status(500).json({ error: "Erro ao criar link" });
     }
}

// Listar links do usuário logado
export async function getMyLinks(req, res) {
     try {
          const links = await Link.find({ userId: req.user.id }).sort({ createdAt: -1 });

          res.json({
               count: links.length,
               links: links.map(link => ({
                    id: link._id,
                    shortId: link.shortId,
                    originalUrl: link.originalUrl,
                    createdAt: link.createdAt
               }))
          });
     } catch (err) {
          console.error("[links/getMyLinks]", err);
          res.status(500).json({ error: "Erro ao buscar links" });
     }
}

// Atualizar link pelo shortId
export async function updateLink(req, res) {
     try {
          const { id } = req.params; // agora é shortId
          const { originalUrl } = req.body;

          const link = await Link.findOne({ shortId: id, userId: req.user.id });
          if (!link) {
               return res.status(404).json({ error: "Link não encontrado ou não pertence a você" });
          }

          link.originalUrl = originalUrl || link.originalUrl;
          await link.save();

          res.json({
               message: "Link atualizado com sucesso",
               link: {
                    id: link._id,
                    shortId: link.shortId,
                    originalUrl: link.originalUrl
               }
          });
     } catch (err) {
          console.error("[links/update]", err);
          res.status(500).json({ error: "Erro ao atualizar link" });
     }
}

// Excluir link pelo shortId
export async function deleteLink(req, res) {
     try {
          const { id } = req.params;

          const link = await Link.findOneAndDelete({ shortId: id, userId: req.user.id });
          if (!link) {
               return res.status(404).json({ error: "Link não encontrado ou não pertence a você" });
          }

          res.json({ message: "Link excluído com sucesso" });
     } catch (err) {
          console.error("[links/delete]", err);
          res.status(500).json({ error: "Erro ao excluir link" });
     }
}

// Redirecionar pelo shortId (rota pública)
export async function redirectLink(req, res) {
     try {
          const { shortId } = req.params;

          const link = await Link.findOne({ shortId });
          if (!link) {
               return res.status(404).json({ error: "Link não encontrado" });
          }

          // Faz o redirecionamento HTTP
          return res.redirect(link.originalUrl);
     } catch (err) {
          console.error("[links/redirect]", err);
          res.status(500).json({ error: "Erro ao redirecionar" });
     }
}
