import Product from "../models/product.js";
import LikeProduct from "../models/likeProduct.js";

async function getProducts(req, res) {
  try {
    const { limit = 10, page = 1 } = req.query;

    const products = await Product.find()
      .select(`name price category subcategory likes`)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalProducts = await Product.countDocuments();

    const updatedProduct = await Promise.all(
      products.map(async (product) => {
        const totalLikes = await LikeProduct.countDocuments({
          productId: product._id,
          isLiked: true,
        });

        return {
          ...product,
          likes: totalLikes,
        };
      })
    );

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
      data: updatedProduct,
    });
  } catch (err) {
    console.error("Error getProducts function:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addProduct(req, res) {
  try {
    const { name, price, category, subcategory } = req.body;

    const newProduct = new Product({
      name,
      price,
      category,
      subcategory,
    });

    if (!name || !price || !category || !subcategory) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", data: newProduct });
  } catch (err) {
    console.error("Error addProduct function:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function searchProducts(req, res) {
  try {
    const name = req.query.q;
    const { limit = 10, page = 1 } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    })
      .select(`name price category subcategory likes`)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalProducts = await Product.countDocuments({
      name: { $regex: name, $options: "i" },
    });

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      totalItems: totalProducts,
      data: products,
    });
  } catch (err) {
    console.error("Error searchProducts function:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function likeProduct(req, res) {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const alreadyLiked = await LikeProduct.findOne({
      userId,
      productId,
    });

    if (alreadyLiked) {
      if (alreadyLiked.isLiked)
        await LikeProduct.updateOne(
          { userId, productId },
          { $set: { isLiked: false } }
        );
      else
        await LikeProduct.updateOne(
          { userId, productId },
          { $set: { isLiked: true } }
        );
    } else {
      const newLike = new LikeProduct({
        userId,
        productId,
        isLiked: true,
      });
      await newLike.save();
    }

    res.status(200).json({
      message: "Update reaction successfully",
    });
  } catch (err) {
    console.error("Error likeProduct function:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { getProducts, addProduct, searchProducts, likeProduct };
