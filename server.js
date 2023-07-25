const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const PORT = 8080

class Room {
    constructor(mainUserId, userList, roomId) {
        this.mainUserId = mainUserId;
        this.userList = [];
        this.roomId = 0;
    }
}

let queue;
let accessToken;

app.use(morgan('tiny'));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/queue', async (req, res) => {
    queue = req.body;
    accessToken = req.query.access;
    res.send('Successfully sent queue to server');
});

app.get('/song', async (req, res) => {
    const searchValue = req.query.search;
    const result = await fetch(`https://api.spotify.com/v1/search?q=${searchValue}&type=track`, {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    const response = await result.json();
    res.send(response);
})

app.post('/song', async (req, res) => {
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
    if (!queue) {
        res.sendFile(path.join(__dirname + '/public/host.html'));
    } else {
        res.sendFile(path.join(__dirname + '/public/host-error.html'));
    }
});

app.get('/queue', async (req, res) => {
    const result = await fetch("https://api.spotify.com/v1/me/player/queue", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
    queue = await result.json();
    res.send(queue);
});

app.get('/join', (req, res) => {
    //TODO CHANGE BACK TO ACTUAL JOIN FUNCTION
    res.sendFile(path.join(__dirname + '/public/temp.html'));
});