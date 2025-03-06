//connection
const mongoose = require('mongoose');

main().then((res) => {
    console.log("Succesfull");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/amazon');
}

//set schema

const bookSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    author: {
        type : String,
    },
    price: {
        type : Number,
    },
})

const Book = mongoose.model("Book",bookSchema);

// let book1 = new Book({
//     title : "Mathematics XII",
//     author : "RD Sharma",
//     price : 12000,
// })

// book1.save()
//     .then((res)=>{console.log(res)})
//     .catch((err)=>{console.log(err);
//     });


let book2 = new Book({
    title : "how to kill Mocking",
    author : "Harper Lee",
    price : "299",
})
book2.save()
    .then((res)=>{console.log(res)})
    .catch((err)=>{console.log(err);
    });
