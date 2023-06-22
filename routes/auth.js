const express=require('express');
const User = require('../models/User');
const router=express.Router()
const { body, matchedData, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchdata=require('../middleware/fetchdata')
require('dotenv').config()

// Creating a new User- NO login Required
router.post('/createuser',[body('email','Enter a valid email').isEmail(),body('name').isLength({min:'3'})],async(req,res)=>{
    const result = validationResult(req);//Checking For errors
    if (result.isEmpty()) {
        // Checking if email alredy exist in db
        try{
        let user=await User.findOne({email:req.body.email});
        var salt = await bcrypt.genSaltSync(10);
        let secpass= await bcrypt.hash(req.body.password, salt);
        const secret=process.env.JWT_SECRET;
        if(user){
            return res.status(400).json({err:"Sorry But the email you entered already exists"})
        }
        else{
            const user=await User.create({
                name:req.body.name,
                email:req.body.email,
                password:secpass
            });
            const data={
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,secret);
            res.json({token})
        }
        }
        catch(err){
            console.error(error.message)
        res.status(500).send("Internal Server Error")
        }

    }
    else{
        res.send({ errors: result.array() });
    }
})



// Login
router.post('/login',[body('email','Enter a valid email').isEmail(),body('password',"Password cant be empty").isLength({min:'0'})],async(req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.send({ errors: result.array() });
    }
    const {email,password}=req.body;
    const secret=process.env.JWT_SECRET;
    try{
        let user= await User.findOne({email:email});
        if(!user){
            return res.status(400).json({error:"Please try to login with valid credentials"})
        }

        const passcompare=await bcrypt.compare(password,user.password);
        if(!passcompare){
            return res.status(400).json({error:"Please try to login with valid credentials"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        const token = jwt.sign(data,secret);
        res.json({token})
    }
    catch(err){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})
router.post('/getuser', fetchdata ,async(req,res)=>{
    try{
        userId=req.user.id;
        const user= await User.findById(userId).select("-password")
        res.send(user);

    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})
module.exports= router