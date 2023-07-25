async function populateUI() {
    const response = await fetch('/queue', {
        method: "GET"
    });
    const queue = await response.json();
    console.log(queue);
    const currentlyPlaying = document.getElementById('currently-playing');
    currentlyPlaying.innerHTML = '<h3>Now Playing</h3>' + `<div class='song' id='now-playing'><img src=${queue.currently_playing.album.images[2].url} height=60 width=60><div class="info"><div class="title">${queue.currently_playing.name}</div><div class="artist">${queue.currently_playing.artists[0].name}</div></div></div>`;
    const queueList = document.getElementById('queue-list');
    let string = '';
    for (let i = 0; i < queue.queue.length; i++) {
        string += `<h2>${i+1}. ${queue.queue[i].name} - ${queue.queue[i].artists[0].name}</h2><br>`
    }
    queueList.innerHTML = string;
}

async function playSongID(songId) {
    const response = await fetch(`/song?songId=${songId}`,  {
        method: 'POST'
    });
    if (response.ok) {
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
    console.log(songList);
    populateSearch(songList);
}

function populateSearch(songList)  {
    const queueList = document.getElementById('queue-list');
    let string = '';
    for (let i = 0; i < songList.tracks.items.length; i++) {
        string += `<h2>${i+1}. ${songList.tracks.items[i].name} - ${songList.tracks.items[i].artists[0].name}</h2><button class="queue-button" id="${songList.tracks.items[i].uri}">Queue It</button><br>`
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