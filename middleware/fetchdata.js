var jwt = require('jsonwebtoken');
require('dotenv').config()
const secret=process.env.JWT_SECRET;

const fetchUser=(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error:"Please auth using valid token"})
    }
    try{
        const data = jwt.verify(token,secret);
        req.user=data.user;
        next();
    }
    catch(error){
        return res.status(401).send({error:"Please auth using valid token"})
    }
}

module.exports =fetchUser;
