const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const clientId = '2857db851d23461f82030f8aa666dbdb';
const clientSecret = '3e282fa25387445da540d3498bf0079d';

const PORT = 8080

class Room {
    constructor(mainUserId, userList, roomId) {
        this.mainUserId = mainUserId;
        this.userList = [];
        this.roomId = 0;
    }
}

let queue;
let playerToken;
let accessToken;

async function APIController() {
    async function _getToken() {
        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const access_token = await _getToken();
    accessToken = access_token;
}

APIController();

app.use(morgan('tiny'));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/queue', async (req, res) => {
    queue = req.body;
    playerToken = req.query.access;
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
        method: "POST", headers: { Authorization: `Bearer ${playerToken}` }
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
        method: "GET", headers: { Authorization: `Bearer ${playerToken}` }
    });
    queue = await result.json();
    res.send(queue);
});

app.get('/join', (req, res) => {
    //TODO CHANGE BACK TO ACTUAL JOIN FUNCTION
    res.sendFile(path.join(__dirname + '/public/join.html'));
});