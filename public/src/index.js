const clientId = '2857db851d23461f82030f8aa666dbdb';
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let queue = undefined;

async function code_check() {
    if (!code) {
        redirectToAuthCodeFlow(clientId);
    } else {
        const accessToken = await getAccessToken(clientId, code);
        const response = await fetchQueue(accessToken);
        queue = response;
        console.log(queue);
        populateUI();
    }
}

async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:8080/host");
    params.append("scope", "user-read-private user-read-email user-modify-playback-state user-read-playback-state");
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
    params.append("redirect_uri", "http://localhost:8080/host");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

async function fetchQueue(token) {
    const result = await fetch("https://api.spotify.com/v1/me/player/queue", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

function populateUI() {
    const currentlyPlaying = document.getElementById('currently-playing');
    currentlyPlaying.innerHTML = 'Currently Playing: ' + queue.currently_playing.name;
    const queueList = document.getElementById('queue-list');
    let string = '';
    for (let i = 0; i < queue.queue.length; i++) {
        string += `<h2>${i+1}. ${queue.queue[i].name}</h2><br>`
    }
    queueList.innerHTML = string;
}

//TODO: send the queue to the API in order to send to other users to populate.

code_check();