const express = require('express');
const morgan = require('morgan');
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

app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname + '/public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/home.html'));
});

//TODO add join functionality to rooms
app.get('/join', (req, res) => {
    res.send('Hello world!');
})

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});

app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/host.html'));
});