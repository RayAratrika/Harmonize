// const artistData = require('./music.js');
const file = require('fs');
const http = require('http');
const url = require('url');

//Read all files

const card = file.readFileSync('../html/card.html', 'utf-8');
const main = file.readFileSync('../html/artist.html', 'utf-8');
const notFound = file.readFileSync('../html/notFound.html', 'utf-8');
const land = file.readFileSync('../html/temp.html', 'utf-8');
const artistCard = file.readFileSync('../html/artistCard.html', 'utf-8');

const artists = file.readFileSync('../json/artists.json', 'utf-8');
const artistsData = JSON.parse(artists);

//Function to replace RegEx

replaceRegEx = (page, dataObj) => {
    let temp = page;
    if (page === artistCard) {
        temp = temp.replace(/{%artist_name_query%}/g, dataObj.artist.split(/\s/).join(''));
        temp = temp.replace(/{%artist_name%}/g, dataObj.artist);
        temp = temp.replace(/{%image_src%}/g, dataObj.src);
    }
    else if (page === card) {
        temp = temp.replace(/{%song_url%}/g, dataObj.url);
        temp = temp.replace(/{%song_name%}/g, dataObj.name);
        temp = temp.replace(/{%rank%}/g, dataObj.attr.rank);
        temp = temp.replace(/{%num_listener%}/g, dataObj.listeners);
    }
    return temp;
};

const iterations = (page, dataFile) => {
    let array = [];
    for (var i = 0; i < dataFile.length - 1; i++)
        array.push(replaceRegEx(page, dataFile[i]));
    array = array.join('');
    return array;
}

const artistCardPage = artistsData.map((element) => replaceRegEx(artistCard, element)).join('');
const landPage = land.replace(/{%artist_card%}/g, artistCardPage);

//Server-Side

const server = http.createServer((req, res) => {
    const { query, path } = url.parse(req.url, true);

    if (path === '/' || path === '/harmonize') {
        res.writeHead(200, {
            "content-type": "text/html",
        });
        res.end(landPage);
    }
    else if (path === '/harmonize?artist=' + query.artist) {

        const artist = file.readFileSync('../json/' + (query.artist) + '.json', 'utf-8');
        const artistFile = JSON.parse(artist);
        const cardPage = iterations(card, artistFile);
        const mainPage = main.replace(/{%cards%}/g, cardPage);
        const mainPage1 = mainPage.replace(/{%artist_name%}/g, query.artist);
        res.writeHead(200, {
            "content-type": "text/html",
        });
        res.end(mainPage1);
    }
    else {
        res.writeHead(404, {
            "content-type": "text/html",
        });
        res.end(notFound);
    }
});


server.listen(3535, '127.0.0.1', () => console.log('Listening on 127.0.0.1:3535'));