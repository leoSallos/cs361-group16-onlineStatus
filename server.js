var fs = require("fs").promises
const {setTimeout, setInterval} = require('timers');
var express = require("express");
var app = express();
app.use(express.static(__dirname));
app.use(express.json());
const port = 8007;

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
    console.log("User online ping.");

    // check if user exists
    const userID = req.params.userID;
    if (userID >= userList.length){
        console.error("User ID does not exist.");
        res.status(404).send("User does not exist.");
        return;
    }

    // update user data
    const currDate = new Date();
    const currTime = currDate.getTime();
    userList[i].lastOnline = currTime;
    userList[i].status = "online"

    // send response
    console.log("Sending success");
    res.status(204);
});

// post new user to database
app.post("/new", function(req, res){
    console.log("New user post.");

    // get post data
    const data = req.body;
    if (!data.name){
        console.error("Improper request body format");
        res.status(400).send("Improper request body format.");
        return;
    }
    
    // add to user list
    const currDate = new Date();
    const currTime = currDate.getTime();
    const newUser = {
        name: data.name,
        lastOnline: currTime,
        status: "online",
    };
    const userID = userList.length;
    userList.push(newUser);

    // send response
    console.log("Sending success");
    res.status(200).json({id: userID});
});

// start server listening
app.listen(port, function(err){
    if (err){
        throw err;
    } else {
        console.log("Server listening on port " + port);
    }
});

// check all users last ping
function updateStatus(){
    // get time values
    const currDate = new Date();
    const currTime = currDate.getTime();
    const lastMinute = currTime - 60;

    // update status of each user
    for (var i = 0; i < userList.length; i++){
        if (userList[i].lastOnline < lastMinute){
            userList[i].status = "offline";
        } else {
            userList[i].status = "online";
        }
    }

    console.log("Statuses updated.");
}

// write update to file
async function writeUserList(){
    const dataString = await JSON.stringify({users: userList});
    try {
        await fs.writeFile(__dirname + "/data.json", dataString, "utf8");
    } catch (err) {
        console.error("File write failed: " + err);
        return;
    }
    console.log("Data save success");
}

// get initial data
async function getUserList(){
    // get data from file
    try {
        var dataString = await fs.readFile(__dirname + "/data.json", "utf8");
    } catch (err) {
        console.error("No data file found.");
        var dataString = "{\"users\": []}";
    }

    console.log("Data init complete.");

    // return userList
    const object = await JSON.parse(dataString);
    return object.users;
}

async function init(){
    userList = await getUserList();
}

var userList;
init();

// 1 min timer
const oneMin = 1000 * 60;
const interval = setInterval(() => {
    updateStatus();
    writeUserList();
}, oneMin);
