import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({ coupon });
    } catch (error) {
        console.error("Error in createCoupon:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.error("Error in deleteCoupon:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id).lean();
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json({ coupon });
    } catch (error) {
        console.error("Error in getCoupon:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().lean();
        if (coupons.length === 0) {
            return res.status(404).json({ message: "No coupons found" });
        }
        res.status(200).json({ coupons });
    } catch (error) {
        console.error("Error in getCoupons:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.status(200).json({ coupon });
    } catch (error) {
        console.error("Error in updateCoupon:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};
