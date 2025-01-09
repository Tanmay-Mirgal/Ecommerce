import Product  from "../models/product.model.js";
import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ error: { message: "User is not defined" } });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const cartItem = {
            product: productId,
            quantity: 1,
            price: product.price,
            totalPrice: product.price
        };
        user.carItems.push(cartItem);
        await user.save();
        res.status(201).json({ message: "Product added to cart successfully" });
    } catch (error) {
        console.error("Error in addToCart:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ error: { message: "User is not defined" } });
        }
        const cart = await User.findById(userId).populate("carItems.product");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartItems = cart.carItems.map(item => item.product);
        res.status(200).json({ message: "Cart retrieved successfully", cart: cartItems });
    } catch (error) {
        console.error("Error in getCart:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user._id;
        const removedProduct = await User.findByIdAndUpdate(
            userId,
            { $pull: { carItems: { product: productId } } },
            { new: true, runValidators: true }
        ).populate("carItems.product");
        if (!removedProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        res.status(200).json({ message: "Product removed from cart successfully", cart: removedProduct.carItems });
    } catch (error) {
        console.error("Error in removeFromCart:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const updateTheQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const updatedProduct = await User.findOneAndUpdate(
            { _id: userId, "carItems.product": productId },
            { $set: { "carItems.$.quanity": quantity } },
            { new: true, runValidators: true }
        ).populate("carItems.product");
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        res.status(200).json({ message: "Product quantity updated successfully", cart: updatedProduct.carItems });
    } catch (error) {
        console.error("Error in updateTheQuantity:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
