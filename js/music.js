exports.getArtist = (artist) => {
    const sa = require('superagent');
    const file = require('fs');

    payload = {
        'method': 'artist.gettoptracks',
        'artist': artist,
        'api_key': '4090d99e1d79c1427734ae0323492716',
        'format': 'json',
    }

    sa.get('http://ws.audioscrobbler.com/2.0/')
        .query(payload)
        .end((err, res) => {
            if (err) console.log(err);
            else {
                const json = JSON.parse(res.text);
                const jsonObj = JSON.stringify(json, null, '\t')
                file.writeFileSync('../json/' + artist + '.json', jsonObj);
            }
        });
};
