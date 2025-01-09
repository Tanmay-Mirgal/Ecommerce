import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minLength:[6,"Password must be at least 6 characters"],
        select:false,
    },
    carItems:[{
        quanity:{
            type:Number,
            default:1,
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"Product",
            
        }
    }],
    role:{
        type:String,
        default:"customer",
        enum:["customer","admin"],
    },

},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User;