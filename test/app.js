const imgParams = {
    opts: {
        height: 500,
        width: 500,
        colors: {
            background: 'black',
            primary: 'white'
        },
        parallelRender: false,
    },
    fields: [
        {
            type: 'image',
            coords: {
                x: 0,
                y: 0,
                // deg: 17
            },
            // content: "https://source.unsplash.com/oXV3bzR7jxI",
            content: "https://source.unsplash.com/ViEBSoZH6M4",
            opts: {
                w: 400,
                h: 400,
                originAtCenter: true,
                fromCenter: true,
                preserveRatio: true
            }
        },
        {
            type: 'text',
            coords: {
                x: 10,
                y: 10,
                deg: 90
            },
            content: 'Hello world',
            opts: {
                color: '-primary',
                textBaseline: 'top'
            }
        },
        {
            type: 'text',
            coords: {
                x: 10,
                y: 50,
                deg: 0
            },
            content: 'Un long texte qui doit comporter au moins un retour à la ligne, voire même deux!\n Il contient un retour à la ligne',
            opts: {
                maxWidth: 400,
                color: '-primary',
                textBaseline: 'top'
            }
        },
    ]
};

const apiUrl = 'http://localhost:8001';

document.getElementById('imgGet').src = `${apiUrl}/?json=${JSON.stringify(imgParams)}`
// document.getElementById('imgGet').height = imgParams.opts.height/2;
// document.getElementById('imgGet').width = imgParams.opts.width/2;
// document.getElementById('imgPost').height = imgParams.opts.height/2;
// document.getElementById('imgPost').width = imgParams.opts.width/2;
fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(imgParams)
})
.then(response=>response.json())
.then(jsonData=>document.getElementById('imgPost').src=jsonData.img);

