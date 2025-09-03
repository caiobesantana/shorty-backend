// import "dotenv/config";
// import app from "./app.js";
// import { connectDB } from "./config/db.js";

// const PORT = process.env.PORT || 3000;
// const MONGODB_URI = process.env.MONGODB_URI;

// (async () => {
//      try {
//           await connectDB(MONGODB_URI);
//           app.listen(PORT, () => {
//                console.log(`[server] Rodando em http://localhost:${PORT}`);
//           });
//      } catch (err) {
//           console.error("[server] Falha ao iniciar:", err);
//           process.exit(1);
//      }
// })();

import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
     try {
          await connectDB(MONGODB_URI);

          // Teste simples com User
          const usersCount = await User.countDocuments();
          console.log(`[db] Usuários existentes: ${usersCount}`);

          app.listen(PORT, () => {
               console.log(`[server] Rodando em http://localhost:${PORT}`);
          });
     } catch (err) {
          console.error("[server] Falha ao iniciar:", err);
          process.exit(1);
     }
})();
