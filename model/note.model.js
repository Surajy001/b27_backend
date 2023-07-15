const mongoose=require("mongoose")

const noteSchema=mongoose.Schema({
    title:String,
    body:String,
    userNAME:String,
    userID:String,
    category:String
},{
     versionKey:false
})
    
//model
const NoteModel=mongoose.model("note",noteSchema)
    
module.exports={
    NoteModel
}
