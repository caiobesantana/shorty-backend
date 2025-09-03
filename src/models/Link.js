import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
     {
          shortId: {
               type: String,
               required: true,
               unique: true,
               minlength: 4,
               maxlength: 10
          },
          originalUrl: {
               type: String,
               required: true
          },
          userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true
          }
     },
     { timestamps: true }
);

export default mongoose.model("Link", linkSchema);
