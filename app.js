const clientId = '2857db851d23461f82030f8aa666dbdb';
const clientSecret = '3e282fa25387445da540d3498bf0079d';

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
    console.log(access_token);
}

APIController();

//This is how API calls need to be factored

// const result = await fetch(endpoint, {
//     method: '',
//     headers: {
//         'Authorization': 'Bearer ' + token
//     }
// });