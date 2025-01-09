import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:[true,"Please provide a price"]
    },
    category:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:[true,"Please provide an image"]
    },
    isFeatured:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true});

const Product = mongoose.model("Product",ProductSchema);
export default Product;