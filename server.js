var fs = require("fs").promises
var express = require("express")
var app = express()
app.use(express.static(__dirname));
app.use(express.json())
const port = 8007

//
// Middleware
//

app.use(function (req, res, next) {
    // allow cross-origin access control
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    next();
});

// 
// Route Service
//

// server ping
app.get("/", function(req, res) {
    console.log("Ping recieved")
    res.status(204);
});

// get user online status
app.get("/list", function(req, res){
    console.log("User list request.");

    // create list to send
    var sendList = [];
    for (var i = 0; i < userList.length; i++){
        const user = {
            name: userList[i].name,
            status: userList[i].status
        };
        sendList.push(user);
    }

    // send list
    console.log("Sending success");
    res.status(200).json({users: sendList});
});

// ping online
app.get("/online/:userID", function(req, res){
});

// post new user to database
app.post("/new", function(req, res){
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});

// write update to file
async function writeUserList(){
}

// check last pings
var userList = [];
// TODO: Add 1min timer
