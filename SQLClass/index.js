const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');

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





   

  //Insering new Data

let q = "INSERT INTO user (id,username,email,password) VALUES ?";

let data=[];
for (let i = 0; i < 100; i++) {
    data.push (getRandomUser());
    
    
}

// let users = [["123b","123_newuserb","abcgmail.comb","abcb"],
//  ["123c","123_newuserc","abcgmail.comc","abcc"]];

try {
    connection.query(q ,[data], (err,result) => {
        if (err) throw err;
        console.log(result); //100 fake user data
    })
} catch (err) {
    console.log(err);
    
}
connection.end();




// console.log(getRandomUser());


