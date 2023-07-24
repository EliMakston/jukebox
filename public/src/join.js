async function populateUI() {
    const response = await fetch('/queue', {
        method: "GET"
    });
    const queue = await response.json();
    const currentlyPlaying = document.getElementById('currently-playing');
    currentlyPlaying.innerHTML = '<h1>Currently Playing: ' + `<img src=${queue.currently_playing.album.images[2].url}>` + queue.currently_playing.name + ` - ${queue.currently_playing.artists[0].name}</h1>`;
    const queueList = document.getElementById('queue-list');
    let string = '';
    for (let i = 0; i < queue.queue.length; i++) {
        string += `<h2>${i+1}. ${queue.queue[i].name} - ${queue.queue[i].artists[0].name}</h2><br>`
    }
    queueList.innerHTML = string;
}

populateUI();