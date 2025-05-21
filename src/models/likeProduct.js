import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    isLiked: { type: Boolean, required: true },
  },
  { timestamps: true }
);

productSchema.index({ userId: 1, productId: 1 }, { unique: true });
productSchema.index({ productId: 1, isLiked: true });

export default mongoose.model("LikeProduct", productSchema);
