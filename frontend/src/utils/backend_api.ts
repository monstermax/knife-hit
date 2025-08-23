
//const apiEndpoint = "http://localhost:5686";
const apiEndpoint = "";


export const registerGame = (): Promise<any> => {
    // Register game
    const apiUrl = `${apiEndpoint}/api/registerGame`;

    const data = {
        name: 'Knife Hit',
        image: '🔪',
        url: 'https://knife.karmas.fr/',
    };

    const url = apiUrl;
    //console.log('post url:', url)

    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            //console.log('register result:', result)
            return result;
        });
}


export const getGame = (): Promise<any> => {
    // Fetch game infos
    const apiUrl = `${apiEndpoint}/api/games`;

    const data = {};

    const querystring = (new URLSearchParams(data)).toString();
    const url = apiUrl + '?' + querystring;
    //console.log('fetch url:', url)

    return fetch(url)
        .then(response => response.json())
        .then(result => {
            //console.log('games result:', result)
            return result;
        });
}


export const getPlayerDataPerGame = (accountAddress: string): Promise<any | null> => {
    // Fetch player data (score+transactions) for our game
    if (!accountAddress) return Promise.resolve(null);

    const apiUrl = `${apiEndpoint}/api/playerDataPerGame`;

    const data = {
        player: accountAddress ?? '',
    };

    const querystring = (new URLSearchParams(data)).toString();
    const url = apiUrl + '?' + querystring;
    //console.log('fetch url:', url)

    return fetch(url)
        .then(response => response.json())
        .then(result => {
            //console.log('player result:', result)
            return result;
        });
}


export const updatePlayerData = (accountAddress: string, score: number): Promise<any | null> => {
    // Update player data
    if (!accountAddress) return Promise.resolve(null);

    const apiUrl = `${apiEndpoint}/api/updatePlayerData`;
    const r = score * Math.round(Math.random() * 999999);

    const data = {
        player: accountAddress,
        scoreAmount: score,
        transactionAmount: 1,
        r,
    };

    const url = apiUrl;
    //console.log('fetch url:', url)

    return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            //console.log('player result:', result)
            return result;
        });
}

