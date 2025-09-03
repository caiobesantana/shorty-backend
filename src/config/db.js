import mongoose from "mongoose";

export async function connectDB(uri) {
     if (!uri) throw new Error("MONGODB_URI não definido no .env");

     // Correção: aqui era 'stinctQuery' e o certo é 'strictQuery'
     mongoose.set("strictQuery", true);

     await mongoose.connect(uri, { autoIndex: true });

     const conn = mongoose.connection;
     conn.on("connected", () => console.log("[db] MongoDB conectado"));
     conn.on("error", (err) => console.error("[db] Erro no MongoDB:", err));
     conn.on("disconnected", () => console.log("[db] MongoDB desconectado"));

     return conn;
}
