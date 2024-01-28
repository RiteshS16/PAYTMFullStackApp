const mongoose =require("mongoose");
const { Schema } =require("zod");

mongoose.connect("mongodb+srv://ritesh160193:Mayank_310795@cluster0.xxs9ntz.mongodb.net/");

const UserSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:3,
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
});

const AccountSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        required:true
    },
    balance:{
        type: Number,
        required:true
    }
});

const User=mongoose.model("User",UserSchema);
const Account=mongoose.model("Bank",AccountSchema);

module.exports={
    User:User,
    Account:Account
}