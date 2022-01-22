const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors")
// noinspection JSValidateTypes
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});

let users = [];
let messages = [];
let index = 0;

io.on("connection", socket => {

    socket.emit("loggedIn", {
        users: users.map(s => s.username),
        messages,
    })

    socket.on("newUser", username => {
        console.log(`${username} has arrived at the party`)
        socket.username = username;
        users.push(socket)
        io.emit("userOnline", socket.username)
    });

    socket.on("msg", msg => {
        let message = {
            index,
            username: socket.username,
            msg
        }
        messages.push(message)
        io.emit("msg", message)
        index++;
    })

    //disconnect
    socket.on("disconnect", () => {
        console.log(`${socket.username} has left the party.`);
        io.emit("userLeft", socket.username);
        users.splice(users.indexOf(socket), 1);
    })
})


server.listen(3000, () => {
    console.log("listening on port 3000")
})

