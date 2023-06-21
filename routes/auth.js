const express=require('express');
const User = require('../models/User');
const router=express.Router()
const { body, matchedData, validationResult } = require('express-validator');

router.post('/createuser',[body('email').isEmail(),body('name').isLength({min:'3'})],async(req,res)=>{
    const result = validationResult(req);//Checking For errors
    if (result.isEmpty()) {
        // Checking if email alredy exist in db
        let user=await User.findOne({email:req.body.email});
        if(user){
            return res.status(400).json({err:"Sorry But the email you entered already exists"})
        }
        else{
            user=await User.create(req.body);
            res.send(req.body)
        }
            

    }
    else{
        res.send({ errors: result.array() });
    }
})

module.exports= router