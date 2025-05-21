import express from "express";
import auth from "../middleware/auth.js";
import {
  addProduct,
  getProducts,
  likeProduct,
  searchProducts,
} from "../controllers/productController.js";
import { cacheMiddleware } from "../middleware/redisCached.js";

const router = express.Router();

router.get("/products", cacheMiddleware(10), getProducts);
router.post("/products", auth, addProduct);
router.get("/products/search", searchProducts);
router.get("/products/:id/like", auth, likeProduct);

export default router;
