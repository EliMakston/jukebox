async function populateUI() {
    const response = await fetch('/queue', {
        method: "GET"
    });
    const queue = await response.json();
    console.log(queue);
    const currentlyPlaying = document.getElementById('currently-playing');
    currentlyPlaying.innerHTML = '<h3>Now Playing</h3>' + `<div class='song' id='now-playing'><h4>1</h4><img src=${queue.currently_playing.album.images[2].url} height=60 width=60><div class="info"><div class="title">${queue.currently_playing.name}</div><div class="artist">${queue.currently_playing.artists[0].name}</div></div></div>`;
    const queueList = document.getElementById('queue-list');
    let string = '';
    for (let i = 0; i < queue.queue.length; i++) {
        string += `<div class='song'><h4>${i+2}</h4><img src=${queue.queue[i].album.images[2].url}><div class="info"><div class="title">${queue.queue[i].name}</div><div class="artist">${queue.queue[i].artists[0].name}</div></div></div>`
    }
    queueList.innerHTML = string;
}

async function playSongID(songId) {
    const response = await fetch(`/song?songId=${songId}`,  {
        method: 'POST'
    });
    if (response.ok) {
        await sleep(500);
        populateUI();
    }
}

const searchForm = document.getElementById('search');
const searchBar = document.getElementById('song-id');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchValue = searchBar.value;
    searchBar.value = '';
    getSongs(searchValue);
});

async function getSongs(searchValue) {
    const result = await fetch(`/song?search=${searchValue}`, {
        method: "GET"
    });
    const songList = await result.json();
    populateSearch(songList);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function populateSearch(songList)  {
    const queueList = document.getElementById('queue-list');
    let string = '';
    for (let i = 0; i < songList.tracks.items.length; i++) {
        string += `<div class='song'><button class="queue-button" id="${songList.tracks.items[i].uri}">X</button><img src=${songList.tracks.items[i].album.images[2].url}><div class="info"><div class="title">${songList.tracks.items[i].name}</div><div class="artist">${songList.tracks.items[i].artists[0].name}</div></div></div>`
    }
    queueList.innerHTML = string;
    const buttons = document.getElementsByClassName("queue-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', (e) => {
            playSongID(e.target.id);
        });
    }
}

populateUI();