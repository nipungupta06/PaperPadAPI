const express=require('express');
const User = require('../models/User');
const router=express.Router()
const { body, matchedData, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.post('/createuser',[body('email').isEmail(),body('name').isLength({min:'3'})],async(req,res)=>{
    const result = validationResult(req);//Checking For errors
    if (result.isEmpty()) {
        // Checking if email alredy exist in db

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
    else{
        res.send({ errors: result.array() });
    }
})

module.exports= router