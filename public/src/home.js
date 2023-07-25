const roomButton = document.getElementById('room-button');
const roomIdText = document.getElementById('room-id');
roomButton.addEventListener('click', async (e) => {
    const roomId = roomIdText.value;
    window.location.href='/join?roomId=' + roomId;
});