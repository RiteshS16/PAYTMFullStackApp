const express=require("express");
const { Account }=require("../db");
const { authMiddleware } =require("../middleware");
const mongoose=require("mongoose");

const accountRouter=express.Router();

accountRouter.get("/balance",authMiddleware,async function(req,res){
    
    const account=await Account.findOne({
        userId:req.userId
    })
    console.log(account.balance);
    res.json({
        msg:account.balance
    })
})


accountRouter.post("/transfer",authMiddleware,async function(req,res){
   const session = await mongoose.startSession();
   session.startTransaction();
    const {to,amount}=req.body;

    //Fetch account within the transaction from which i want to transfer the money
    const account=await Account.findOne({userId:req.userId}).session(session);

    if(!account || account.balance<amount)
    {
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insufficient balance"
        });
    }
    
    const toAccount=await Account.findOne({userId:to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        });
    }

    //Perfom the transfer
    await Account.updateOne({
        userId:req.userId
    },{
        "$inc":{
            balance:-amount
        }
    }).session(session);

    await Account.updateOne({
        userId:to
    },{
        "$inc":{
            balance:amount
        }
    }).session(session);

    await session.commitTransaction();
    res.json({
        message:"Transfer Successful"
    })

})

module.exports=accountRouter;