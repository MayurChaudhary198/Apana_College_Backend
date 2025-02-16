const mongoose = require('mongoose');
const { chatSchema } = require('./models/chat');

main().then(() => {
    console.log("connection successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}
const Chat = mongoose.model("Chat",chatSchema);

let allchats = ([
    {
        from: "neha",
        to: "priya",
        msg: "send me your exam sheets",
        created_at: new Date()
    },
    {
        from: "rahul",
        to: "ankit",
        msg: "share your project report",
        created_at: new Date()
    },
    {
        from: "ananya",
        to: "sneha",
        msg: "send me the assignment pdf",
        created_at: new Date()
    },
    {
        from: "vikas",
        to: "rohit",
        msg: "forward me the meeting notes",
        created_at: new Date()
    },
    {
        from: "divya",
        to: "pallavi",
        msg: "can you send the lab manual?",
        created_at: new Date()
    },
    {
        from: "arjun",
        to: "sahil",
        msg: "please share the presentation slides",
        created_at: new Date()
    }
]);

Chat.insertMany(allchats);