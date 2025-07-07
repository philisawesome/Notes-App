const express = require('express');
const app= express();
let notes =[];
const PORT= 3000;

app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Welcome to your Notes API!');
});

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);

});

app.get('/notes',(req, res)=>{
    res.json(notes);

});

app.post('/notes',(req,res)=>{
    const {title, content}=req.body;

    if(!title|| !content){
       return res.status(400).json({error:'Title and content are required'});
    }

    const newNote={
        id: Date.now(),
        title,
        content
    };
    notes.push(newNote);

    res.status(201).json({
        message: 'Note added',
        note: newNote
    });
});


app.delete('/notes/:id', (req,res)=>{
    const noteId= parseInt(req.params.id);
    const index= notes.findIndex(note=>note.id===noteId);

    if(index === -1){
      return res.status(404).json({error: 'Note not found'});

    }
    const deletedNote= notes.splice(index,1)[0];

    res.status(200).json({
        message:'Note deleted',
        note: deletedNote


    });



});

app.put('/notes/:id', (req,res)=>{
    const noteId=parseInt(req.params.id);
    const index=notes.findIndex(note=>note.id===noteId);

    if(index=== -1){
        return res.status(404).json({error: 'Note not found'});
    }

    const {title, content}=req.body;

    if(!title || !content){
        return res.status(400).json({error:'Title and Content are required!!'});

    }

    notes[index].title= title;
    notes[index].content=content;

    res.status(201).json({
        message:'Note updated',
        note: notes[index]


    });
});

app.get('/notes/:id', (req,res)=>{
    const noteId=parseInt(req.params.id);
    const index=notes.findIndex(note=>note.id===noteId);

    if(index===-1){
        return res.status(404).json({error: 'Note not found'});

    }

    res.json(notes[index]);



});





