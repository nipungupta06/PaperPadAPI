const express=require('express');
const Note = require('../models/Notes');
const fetchUser = require('../middleware/fetchdata');
const router=express.Router();
const { body, validationResult } = require('express-validator');

router.get('/fetchallnotes',fetchUser,async(req,res)=>{
    const notes=await Note.find({user:req.user.id});
    res.json(notes);
})

router.post('/addnote',fetchUser,[body('title','Title is compulsory').isLength({min: 1}),body("description",'Enter a Description').isLength({ min: 0 })],async(req,res)=>{
    const result = validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({ errors: result.array() });
    }
    try{
        const {title,description,tag}=req.body;
        const note=new Note ({
            title,description,tag,user:req.user.id
        })
        const SavedNotes= await note.save();
        res.send(SavedNotes);
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }

})
router.put('/updatenote/:id',fetchUser,async(req,res)=>{
    const{title,description,tag}=req.body;
    const newNote={};
    if(title){newNote.title=title}
    if(description){newNote.description=description}
    if(tag){newNote.tag=tag}
try{
    let note= await  Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found");
    }
    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("Not Allowed")
    }
    note= await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json(note)
}
catch(error){
    console.error(error.message)
        res.status(500).send("Internal Server Error")
}
})

router.delete('/deletenote/:id',fetchUser,async(req,res)=>{
    try{
    let note= await  Note.findById(req.params.id);
    if(!note){
        return res.status(404).send("Not Found");
    }
    if(note.user.toString()!==req.user.id)
    {
        return res.status(401).send("Not Allowed")
    }
    note= await Note.findByIdAndDelete(req.params.id)
    res.json(note)
}
    catch(error){
        console.error(error.message)
            res.status(500).send("Internal Server Error")
    }
})
module.exports = router;