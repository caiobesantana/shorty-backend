// src/config/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Definições básicas da documentação
const options = {
     definition: {
          openapi: "3.0.0",
          info: {
               title: "Shorty API",
               version: "1.0.0",
               description: "API de encurtador de links multiusuário",
          },
          servers: [
               {
                    url: "http://localhost:3000",
               },
          ],
     },
     apis: ["./src/routes/*.js"], // <-- onde estão suas rotas com anotações Swagger
};

// Gera a especificação
export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
