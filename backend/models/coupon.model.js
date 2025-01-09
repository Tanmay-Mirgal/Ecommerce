import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({

},{timestamps:true});

const Coupon = mongoose.model("Coupon",couponSchema);
export default Coupon;