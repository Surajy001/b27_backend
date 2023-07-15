const express=require("express");
const {UserModel}=require("../model/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config()

const userRouter=express.Router()

userRouter.post("/register", async(req,res)=>{
    const {username,email,password,dob,location,role}=req.body
   try{
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.json({error:err.message})
            }else{
                const user=new UserModel({username,email,password:hash,dob,location,role})
                await user.save()
                res.json({msg:"User has been registered",user:req.body})
            }
        })
   }catch(err){
    res.status(500).json({error:err.message})
   }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    // let token=jwt.sign({course:"BE"},"masai")
                    let token=jwt.sign({userID:user._id,userNAME:user.username},process.env.secret)
                    res.json({msg:"Login Successful",token})
                }else{
                    res.json({error:"Wrong Credentcials"})
                }
            })
        }else{
            res.json({msg:"user does not exist"})
        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

module.exports={
    userRouter
}
