const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = 8080

const roomArray = [];

class Room {
    constructor(userToken, queue) {
        this.userToken = userToken;
        this.queue = queue;
        this.roomId = generateRoomId();
    }
}

function generateRoomId (){
    let string = '';
    for (let i = 0; i < 6; i++) {
        string += Math.floor(Math.random() * 10);
    }
    return string;
}

app.use(morgan('tiny'));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/queue', async (req, res) => {
    const newRoom = new Room(req.query.access, req.body);
    console.log(newRoom);
    roomArray.push(newRoom);
    res.send(newRoom.roomId);
});

app.get('/song', async (req, res) => {
    const accessToken = getRoomToken(req.query.roomId);
    const searchValue = req.query.search;
    const result = await fetch(`https://api.spotify.com/v1/search?q=${searchValue}&type=track`, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    const response = await result.json();
    res.send(response);
})

app.post('/song', async (req, res) => {
    const accessToken = getRoomToken(req.query.roomId);
    const trackFromSearch = req.query.songId;
    const result = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${trackFromSearch}`, {
        method: "POST", headers: { Authorization: `Bearer ${accessToken}` }
    });
    res.send('This worked');
})

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});

app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/host.html'));
});

app.get('/queue', async (req, res) => {
    const accessToken = getRoomToken(req.query.roomId);
    const result = await fetch("https://api.spotify.com/v1/me/player/queue", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    queue = await result.json();
    res.send(queue);
});

app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/join.html'));
});

function getRoomToken(roomId) {
    for (let i = 0; i < roomArray.length; i++) {
        if (roomId === roomArray[i].roomId) {
            return roomArray[i].userToken;
        }
    }
}