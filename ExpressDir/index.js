const express = require("express");
const app = express();

let port = 8080;

app.listen(port , () => {
    console.log(`app is listening on port ${port}`);
    
});

app.get("/", (req ,res)=>{
    res.send("hii i am root");
})

// app.get("/:username", (req ,res)=>{
//     let {username} = req.params;
//     res.send(`hii @${username}.`);
// })

app.get("/search", (req ,res)=>{
    console.log(req.query);
    res.send("your sucess ");
})