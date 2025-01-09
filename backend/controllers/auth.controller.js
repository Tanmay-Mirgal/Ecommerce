import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import  redis  from '../lib/redis.js';
const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
    return { accessToken, refreshToken };
}
const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh-token${userId}`, refreshToken, "EX", 60 * 60 * 24 * 7);

}
const getSetCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
}

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
        });

        //Access token and refresh token generating ....

        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        getSetCookies(res, accessToken, refreshToken);
        res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });

    }
}
export const login = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        if (user && isPasswordCorrect) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            getSetCookies(res, accessToken, refreshToken);
            res.status(201).json({ user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || "Internal Server Error" });

    }
}
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
            await redis.del(`refresh-token${decoded.userId}`);
        }
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });

    }
}


//which is used to refresh the access token 
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const storedRefreshToken = await redis.get(`refresh-token${decoded.userId}`);
        if (refreshToken !== storedRefreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 60 * 1000),
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
}

export const getProfile= async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error?.message || "Internal Server Error" });
    }
}