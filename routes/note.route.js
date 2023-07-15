const express=require("express");
const {NoteModel}=require("../model/note.model");
const {auth} = require('../middleware/auth.middleware');

const noteRouter=express.Router();

noteRouter.use(auth);

noteRouter.post("/create",async(req,res)=>{
    try{
        const noteData = {
            ...req.body,
          };
       const note=new NoteModel(noteData);
       await note.save();
       res.json({msg:"New Note has been added",note:req.body});
    }catch(err){
        res.json({error:err.message});
    }
})

noteRouter.get("/",async(req,res)=>{
    try{
        const notes=await NoteModel.find({userID:req.body.userID});
        res.send(notes);
    }catch(err){
        res.json({error:err.message});
    }
})

noteRouter.get("/:noteID", async (req, res) => {
    const { noteID } = req.params;
    const userID = req.body.userID;
  
    try {
      const note = await NoteModel.findOne({ _id: noteID, userID });
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.json(note);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

noteRouter.patch("/update/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID;
    const {noteID}=req.params;
    try{
    const note=await NoteModel.findOne({_id:noteID});
    const userIDinNoteDoc=note.userID;
    //console.log(note);
    if(userIDinUserDoc===userIDinNoteDoc){
        //console.log("userID in UserDoc",userIDinUserDoc ,"userID in NoteDoc",userIDinNoteDoc);
        await NoteModel.findByIdAndUpdate({_id:noteID},req.body);
        res.json({msg:`${note.title} has been updated`});
    }else{
        //console.log("userID in UserDoc",userIDinUserDoc ,"userID in NoteDoc",userIDinNoteDoc);
        res.json({msg:"Not Authorized"}); 
    }
    }catch(err){
        res.json({error:err.message});  
    }
})

noteRouter.delete("/delete/:noteID",async(req,res)=>{
    const userIDinUserDoc=req.body.userID;
    const {noteID}=req.params;
    try{
    const note=await NoteModel.findOne({_id:noteID});
    const userIDinNoteDoc=note.userID;
    //console.log(note);
    if(userIDinUserDoc===userIDinNoteDoc){
        //console.log("userID in UserDoc",userIDinUserDoc ,"userID in NoteDoc",userIDinNoteDoc);
        await NoteModel.findByIdAndDelete({_id:noteID},req.body);
        res.json({msg:`${note.title} has been Deleted`});
    }else{
        //console.log("userID in UserDoc",userIDinUserDoc ,"userID in NoteDoc",userIDinNoteDoc);
        res.json({msg:"Not Authorized"}); 
    }
    }catch(err){
        res.json({error:err.message});  
    }
})

module.exports={
    noteRouter
}
