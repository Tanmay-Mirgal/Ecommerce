
import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import { v2 as cloudinary } from 'cloudinary';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        if (!featuredProducts || featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }
        res.status(200).json(featuredProducts);
    } catch (error) {
        console.error("Error in getFeaturedProducts:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, isFeatured } = req.body;
        const image = req.files?.image;

        let imageUrl = null;
        if (image) {
            const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: 'products' });
            imageUrl = cloudinaryResponse.secure_url;
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: imageUrl ? imageUrl : "",
            isFeatured
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error in createProduct:", error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
}
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        let recommendedProducts = await redis.get('recommended_Products');
        if (recommendedProducts) {
            return res.json(JSON.parse(recommendedProducts));
        }
        // if not in redis, then check in mongodb
        recommendedProducts = await Product.aggregate([
            { $match: { isRecommended: true } },
            { $sample: { size: 3 } },
        ]);
        // .lean() is not used here because aggregation returns plain objects
        if (!recommendedProducts || recommendedProducts.length === 0) {
            return res.status(404).json({ message: "No recommended products found" });
        }

        // store in redis for future access
        await redis.set('recommended_Products', JSON.stringify(recommendedProducts));
        res.status(200).json(recommendedProducts);
    } catch (error) {
        console.error("Error in getRecommendedProducts:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export const getCategoryProducts = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getCategoryProducts:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}
export const toggleFeaturedProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.isFeatured = !product.isFeatured;
        await product.save();
        await redis.set(`featured_Products_${id}`, product.isFeatured);
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("Error in toggleFeaturedProducts:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


