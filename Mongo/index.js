const mongoose = require('mongoose');

main().then((res) => {
    console.log("Succesfull");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
})

const User = mongoose.model("User", userSchema);
// const Employee = mongoose.model("Employee", userSchema);

// User.insertMany([
//     {name:"Tony",email:"Tony@gmail.com",age:50},
//     {name:"Peter",email:"peter@gmail.com",age:30},
//     {name:"Bruce",email:"bruce@gmail.com",age:47}
// ]).then((res)=>{console.log(res);
// });

// User.find().then((data)=>{console.log(data);
// })

// User.find({age : {$gte : 48}}).then((data)=>{console.log(data);})



// User.updateOne({name:"Adam"},{age:49}).then((res)=>{console.log(res);
    
// })


// const user1 = new User({
//     name: "Adam",
//     email: "adam@yahoo.in",
//     age: 48,
// })

// const user2 = new User({
//     name: "eve",
//     email: "eve@yahoo.in",
//     age: 48,
// })
// user2.save()
//     .then((res) => {
//         console.log(res)
//     })
//     .catch((err) => {
//             console.log(err);
//      });
    