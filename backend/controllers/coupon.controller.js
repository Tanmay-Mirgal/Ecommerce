import Coupon from "../models/coupon.model.js";
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.findOne({userId:req.user._id,isActive:true});
        
        res.json(coupons || null);
    } catch (error) {
        console.error("Error in getCoupons:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

export const ValidateCoupon = async (req, res) => {
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code,isActive:true,userId:req.user._id});
        if(!coupon){
            return res.status(404).json({ message: "Coupon not found" });
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }
        res.json({
            discountPercentage:coupon.discountPercentage,
            expirationDate:coupon.expirationDate,
            isActive:coupon.isActive,
            code:coupon.code,
            userId:coupon.userId,
            message:"Coupon validated successfully"
        })
    } catch (error) {
        console.error("Error in ValidateCoupon:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
        
    }
}
