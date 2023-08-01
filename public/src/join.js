const query = window.location.search;
const urlParams = new URLSearchParams(query);
const searchForm = document.getElementById('search');
const searchBar = document.getElementById('song-id');

const roomId = urlParams.get('roomId');
console.log(roomId);

async function populateUI() {
    const response = await fetch(`/queue?roomId=${roomId}`, {
        method: "GET"
    });
    const queue = await response.json();
    console.log(queue);
    const heading = document.getElementById('heading');
    heading.innerHTML = 'Next Up';
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
    const response = await fetch(`/song?songId=${songId}&roomId=${roomId}`,  {
        method: 'POST'
    });
    if (response.ok) {
        await sleep(500);
        searchBar.value = '';
        populateUI();
    }
}


searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchValue = searchBar.value;
    searchBar.value = '';
    getSongs(searchValue);
});

searchBar.addEventListener('input', (e) => {
    if (searchBar.value === '') {
        populateUI();
    } else {
        const searchValue = searchBar.value;
        getSongs(searchValue);
    }
});

async function getSongs(searchValue) {
    const result = await fetch(`/song?search=${searchValue}&roomId=${roomId}`, {
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
        string += `<div class="queue-button" id="${songList.tracks.items[i].uri}"><div class='song'><div class="info"><div class="title">${songList.tracks.items[i].name}</div><div class="artist">${songList.tracks.items[i].artists[0].name}</div></div></div></div>`
    }
    queueList.innerHTML = string;
    const heading = document.getElementById('heading');
    heading.innerHTML = 'Search Results';
    const buttons = document.getElementsByClassName("queue-button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', (e) => {
            playSongID(e.currentTarget.id);
        });
    }
}

populateUI();

const loginButton = document.getElementById('login-button');

const clientId = '2857db851d23461f82030f8aa666dbdb';
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

loginButton.addEventListener('click', (e) => {
    code_check();
});

if (code) {
    code_check();
}

async function code_check() {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const response = await fetchPlaylists(accessToken);
        playlists = response;
        console.log(playlists);
    }
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:8080/join");
    params.append("scope", "playlist-read-private");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:8080/join");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchPlaylists(token) {
    const result = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}