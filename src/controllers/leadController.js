// src/controllers/leadController.js
import { validationResult } from "express-validator";
import Lead from "../models/Lead.js";
import Link from "../models/Link.js";
import logger from "../utils/logger.js";

/**
 * Controller: createLead
 * Chamado em POST /api/leads
 */
export async function createLead(req, res) {
     try {
          // validação do express-validator
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
               logger.warn(`[leads/create] Erros de validação: ${JSON.stringify(errors.array())}`);
               return res.status(400).json({
                    error: "Erro de validação",
                    details: errors.array().map(err => ({
                         field: err.param,
                         message: err.msg,
                    })),
               });
          }

          const { shortId, name, phone } = req.body;

          // busca link pelo shortId
          const link = await Link.findOne({ shortId });
          if (!link) {
               logger.warn(`[leads/create] Link não encontrado: ${shortId}`);
               return res.status(404).json({ error: "Link não encontrado" });
          }

          // normaliza telefone: apenas dígitos
          const phoneDigits = phone.replace(/\D/g, "");

          const lead = await Lead.create({
               linkId: link._id,
               shortId,
               name,
               phone: phoneDigits,
               ip: req.ip,
               userAgent: req.get("user-agent"),
          });

          logger.info(`[leads/create] Lead salvo: ${lead._id} para shortId ${shortId}`);

          // retorna para onde redirecionar o usuário
          res.status(201).json({ redirectTo: link.originalUrl });
     } catch (err) {
          logger.error(`[leads/create] Erro: ${err.message}`);
          res.status(500).json({ error: "Erro interno ao salvar lead" });
     }
}
