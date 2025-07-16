const express = require('express');
const app= express();
const PORT= 3000;
app.use(express.json());

//connecting to mongoose
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/notesDB")
    .then(()=> console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:",err));

//creating schema 
const noteSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true

    },
    content: {
        type:String, 
        required:true

    }


});
//creating a model 
const Note= mongoose.model("Note",noteSchema);


app.get('/', (req, res)=>{
    res.send('Welcome to your Notes API!');
});

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);

});

app.get('/notes', async (req, res)=>{
   try{
    const notes = await Note.find();
    res.json(notes);
   }
   catch(err){
    res.status(500).json({error: "Failed to fetch notes"});
   }
    

});

app.post('/notes',async(req,res)=>{
   const {title, content} = req.body;

   if(!title || !content){
    return res.status(400).json({error: "Title and Content are required"});
   }

   try{
    const newNote = await Note.create({title, content});
    res.status(201).json({
        message:"New Note Added",
        note: newNote

    });
   }
   catch(err){
    res.status(500).json({error: "Failed to add new note"});
   }
   
});


app.delete('/notes/:id', async (req,res)=>{
    try{
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if(!deletedNote){
            return res.status(404).json({error:"Note not found"});
        }
        res.status(200).json({
            message:"Note successfully deleted",
            note: deletedNote
        });
    }
    catch(err){
        res.status(400).json({
            error: "Invalid note ID or deletion failed"
        });

    }
    


});

app.put('/notes/:id', async (req,res)=>{
   const {title, content}= req.body;

   if(!title||!content){
    return res.status(400).json({error: "Title and Content are required"});
   }

   try{
    const updatedNote= await Note.findByIdAndUpdate(
        req.params.id,
        {title, content},
        {new: true,runValidators:true }
    );
    if(!updatedNote){
        return res.status(404).json({error: "Note not found"});
    }
    res.status(200).json({
        message: "Note Updated",
        note:updatedNote

    });
   }
   catch(err){
    res.status(400).json({error: "Invalid note ID or update failed"});
   }



});

app.get('/notes/:id', async (req,res)=>{
    const noteId= req.params.id;

    try{
        const note= await Note.findById(noteId);
        if(!note){
            return res.status(404).json({error:"Note not found"});
        }
        res.json(note);
    }
    catch(err){
        res.status(400).json({error: "Invalid Note ID"});
    }
});








