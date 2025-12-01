var fs = require("fs").promises
const {setTimeout, setInterval} = require('timers');
var express = require("express");
var app = express();
app.use(express.static(__dirname));
app.use(express.json());
const port = 8007;

const HEARTBEAT_URL = "http://localhost:8001/heartbeat";
let monitorServiceStatus = "offline";

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
    console.log("Ping recieved\n")
    res.sendStatus(204);
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

    sendList.push({
        name: "Monitor Service",
        status: monitorServiceStatus
    });

    // send list
    console.log("Sending success\n");
    res.status(200).json({users: sendList});
});

// ping online
app.get("/online/:userID", function(req, res){
    console.log("User online ping.");

    // log request user
    const userID = req.params.userID;
    console.log("Recieved from:", userID);
    
    // check if user exists
    if (userID >= userList.length){
        console.error("User ID does not exist.");
        res.status(404).send("User does not exist.\n");
        return;
    }

    // update user data
    const currDate = new Date();
    const currTime = currDate.getTime();
    userList[userID].lastOnline = currTime;
    userList[userID].status = "online"

    // send response
    console.log("Sending success\n");
    res.sendStatus(204);
});

//
// Internal Logic
//

// check all users last ping
function updateStatus(){
    // get time values
    const currDate = new Date();
    const currTime = currDate.getTime();
    const oneMin = 1000 * 60;
    const lastMinute = currTime - oneMin;

    // update status of each user
    for (var i = 0; i < userList.length; i++){
        if (userList[i].lastOnline < lastMinute){
            userList[i].status = "offline";
        } else {
            userList[i].status = "online";
        }
    }

    console.log("Status updated.");
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
    console.log("Data save success\n");
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

    // return userList
    const object = await JSON.parse(dataString);
    return object.users;
}

async function sendHeartbeat() {
    try {
        const res = await fetch(HEARTBEAT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service: "status-service",
                timestamp: Date.now()
            })
        });

        if (!res.ok) {
            console.error("Heartbeat failed with status", res.status);
            monitorServiceStatus = "offline";
            return;
        }

        monitorServiceStatus = "online";
        console.log("Heartbeat OK, monitorServiceStatus =", monitorServiceStatus);
    } catch (err) {
        console.error("Heartbeat error:", err);
        monitorServiceStatus = "offline";
    }
}

async function init(){
    userList = await getUserList();
    console.log("Data init complete:", userList);

    // start server listening
    app.listen(port, function(err){
        if (err){
            throw err;
        } else {
            console.log("Server listening on port " + port + "\n");
        }
    });

    sendHeartbeat();
}

var userList;
init();

// 1 min timer
const oneMin = 1000 * 60;
const interval = setInterval(() => {
    updateStatus();
    writeUserList();
    sendHeartbeat();
}, oneMin);
