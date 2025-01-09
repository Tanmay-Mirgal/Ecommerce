import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error?.message || "Internal Server Error" })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Access denied. Only admin can access this resource." })
    }
}


