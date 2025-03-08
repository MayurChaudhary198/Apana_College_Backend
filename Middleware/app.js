const express = require("express")
const app = express()
const ExpressError = require("./ExpressError")

// app.use((req, res, next)=> {
//     console.log("Hi ,  I am middleware ");
//     next()
// })

//logger
// app.use((req,res,next) => {
//     req.time= new Date(Date.now()).toString()
//     console.log(req.method,req.path,req.hostname,req.time);
//     next()
    
// })

// app.use("/random", (req ,res ,next ) => {
//     console.log("I am only for random");
//     next();
// })

const checktoken = ("/api" , (req ,res, next) => {
    let { token } = req.query;
    if(token === "abcd"){
        next()
    }
    throw new ExpressError(401,"ACCESS DENIED!")
})

app.get("/api", checktoken , (req,res) => {
    res.send("Data")
})

app.get("/err", (req, res)=>{
    abcd=abcd;
    
})

app.get("/admin", (req,res)=>{
    throw new ExpressError(403,"acess is forbidden")
})

app.use((err,req,res,next)=>{
    let{ status , message } = err;
    res.status(status).send(message )
})



app.get("/", (req, res)=>{
    res.send("Hi , I am a root")
})

app.get("/random", (req, res)=>{
    res.send("Hi ,  I am randompage")
})

app.listen(8080, ()=>{
    console.log("server listening to port");
    
})