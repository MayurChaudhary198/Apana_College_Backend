const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const { log } = require('console');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

let port = 8080;

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname,"/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'mayur@2900',
  });


  let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.username(), // before version 9.1.0, use userName()
      faker.internet.email(),
      faker.internet.password(),
    ];
  }

//   //Insering new Data

// let q = "INSERT INTO user (id,username,email,password) VALUES ?";

// let data=[];
// for (let i = 0; i < 100; i++) {
//     data.push (getRandomUser());  
// }

// let users = [["123b","123_newuserb","abcgmail.comb","abcb"],
//  ["123c","123_newuserc","abcgmail.comc","abcc"]];

// try {
//     connection.query(q ,[data], (err,result) => {
//         if (err) throw err;
//         console.log(result); //100 fake user data
//     })
// } catch (err) {
//     console.log(err);
    
// }
// connection.end();




// console.log(getRandomUser());


app.get("/",(req,res) => {

  let q =`SELECT count(*) FROM user`;
  try {
    connection.query(q,(err,result) => {
     if(err) throw err;
     let count = result[0]["count(*)"];
     res.render("home.ejs",{count});
    });
    
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB")
  }
})

//Get all user info
app.get("/user",(req,res) => {

  let q =`SELECT * FROM user`;
  try {
    connection.query(q,(err,users) => {
     if(err) throw err;
    //  res.render("user.ejs");
    res.render("showusers.ejs",{ users });
    });
    
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB")
  }
})

//EDIT route
app.get("/user/:id/edit",(req,res) => {

  let {id} = req.params;
  let q =`SELECT * FROM user WHERE id = '${id}'`
  try {
    connection.query(q,(err,result) => {
     if(err) throw err;
     let user = result[0];     
    res.render("edit.ejs",{ user });
    });
    
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB")
  }
})

//update route

app.patch("/user/:id",(req,res) => {
  let {id} = req.params;
  let {password:formPass ,username: newUsername} = req.body;

  let q =`SELECT * FROM user WHERE id = '${id}'`
  try {
    connection.query(q,(err,result) => {
     if(err) throw err;
     let user = result[0]; 
     if(formPass != user.password){
      res.send("Wrong password")
     }else{
      let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
      connection.query(q2,(err,result) => {
        if(err) throw err;
        res.redirect("/user");
      })
     }
    });
    
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB")
  }
})

app.get("/user/new", (req,res) => {
  res.render("new.ejs")
})


app.post("/user", (req,res) => {
  const {username ,password, email }=req.body;
  let id = uuidv4();

  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
 
  try {
    connection.query(q,(err,result) => {
     if(err) throw err;
    console.log("add new user");
    res.redirect("/user");
    
    });
    
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB")
  }
})

app.get("/user/:id/delete", (req,res) => {
  let {id } =req.params;
  let q= `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
})

app.delete("/user/:id/", (req,res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if(user.password != password){
        console.log("Wrong Password");
      } 
      else{
        let q2 = `DELETE FROM user WHERE id='${id}'`;

        connection.query(q2, (err, result) => {
          if (err) throw err;
          else{
            console.log(result);
            console.log("deleted");
            res.redirect("/user");
            
          }
        });

      }
    });
  } catch (err) {
    res.send("some error with DB");
  }

})

// console.log(getRandomUser());


app.listen("8080", () => {
  console.log("server is listening to port 8080");
  

})