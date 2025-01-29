const express = require("express");
const app = express();

const port = 8080;

app.set("view engine", "ejs");
// app.set("views", path.join(__dirname,"/views"));

app.get("/",(req,res) => {
    res.render("home.ejs")
})
app.get("/rolldice",(req,res) => {
    diceValue=Math.floor(Math.random()*6)+1
    res.render("rolldice.ejs",{ num : diceValue })
})

app.get("/ig/:username" ,(req,res) => {
    let { username } = req.params;
    res.render("instagram.ejs",{username})
})

app.listen(port ,() =>{
    console.log(`listning on port ${port}`);
})