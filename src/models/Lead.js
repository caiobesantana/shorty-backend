import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
     {
          linkId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Link",
               required: true,
          },
          shortId: {
               type: String,
               required: true,
          },
          name: {
               type: String,
               required: true,
               minlength: 2,
          },
          phone: {
               type: String,
               required: true,
               minlength: 10,
          },
          ip: {
               type: String,
          },
          userAgent: {
               type: String,
          },
     },
     { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
