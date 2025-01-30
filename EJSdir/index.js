const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

// app.use(express.static("public"))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public/js")));
app.use(express.static(path.join(__dirname,"public/css")));
app.get("/",(req,res) => {
    res.render("home.ejs")
})
app.get("/rolldice",(req,res) => {
    diceValue=Math.floor(Math.random()*6)+1
    res.render("rolldice.ejs",{ num : diceValue })
})

app.get("/ig/:username" ,(req,res) => {
    let { username } = req.params;
    const instaData = require("./data.json")
    const data=instaData[username] 
    if(data){
        res.render("instagram.ejs",{data})
    }
    else{
        res.render("error.ejs")
    }
    
})

app.listen(port ,() =>{
    console.log(`listning on port ${port}`);
})