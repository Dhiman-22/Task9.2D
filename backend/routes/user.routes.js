const express=require("express")
const userRouter=express.Router()
const {UserModel}=require("../model/user.model")
const jwt=require("jsonwebtoken")
const bcrypt = require('bcrypt');


//registration
userRouter.post("/register",async(req,res)=>{
    const {email,pass,name}=req.body
     const data = await UserModel.find({email});
    
    if(data.length>0){
        res.send({"msg":"Email already Registered"})
    }else{
        try{
            bcrypt.hash(pass, 5, async (err, hash) => {
                const user=new UserModel({email,pass:hash,name})
                await user.save()
                res.status(200).send({"msg":"Registration has been done!"})
            });
        }catch(err){
            res.status(400).send({"msg":err.message})
        }
    }
   
})

//login(authentication)
userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(user){
            
            bcrypt.compare(pass,user.pass, (err, result) => {
                if(result){
                    res.status(200).send({"msg":"Login successfull!","token":jwt.sign({"userID":user._id},"masai"),"name":user.name})
                } else {
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            });
        }else{
            res.status(400).send({"msg":"Wrong Credentials"})
        }
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
})


module.exports={
    userRouter
}