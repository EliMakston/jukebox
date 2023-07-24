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

app.use(morgan('tiny'));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

app.post('/queue', (req, res) => {
    queue = req.body;
    console.log(queue);
    res.send('Successfully sent queue to server');
})

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});

app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/host.html'));
});

app.get('/queue', (req, res) => {
    res.send(queue);
})

app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/join.html'));
})