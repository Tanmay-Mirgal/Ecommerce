import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.connection.js";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analayticsRoutes from "./routes/analaytics.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : "http://localhost:5173",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    })
);
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    limits: { fileSize: 100 * 1024 * 1024 },
    createParentPath: true,
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupon',couponRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/analaytics',analayticsRoutes)

setTimeout(async () => {
    try {
        await fs.unlink(path.join(__dirname, "tmp", "file.txt"));
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error(error);
        }
    }
}, 5000);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
});
