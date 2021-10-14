require('dotenv').config();
// const bodyParser = require('body-parser');

const CanvasManager = require('./src/CanvasManager');
const cors = require('cors');
const express = require('express')
const path = require("path");
const app = express()
const PORT = process.env.PORT ?? 80
const HOST = process.env.HOST ?? 'localhost'

app.set('trust proxy', true)

// app.use(bodyParser.json());                         // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());                            // to support JSON-encoded bodies
app.use(express.urlencoded());                      // to support URL-encoded bodies
app.use(cors({
    origin: '*'
}));

app.get('/', function(req, res) {
    res.send('work')
})

app.get('/generate/image', async (req, res)=>{
    return
    const imgParams = JSON.parse(req.query.json);
    const canvasManager = new CanvasManager(
        imgParams.opts,
        imgParams.fields,
    );

    const data = await canvasManager.buffer();
    res.setHeader('Content-Type', 'image/jpeg')
    // res.setHeader('Content-disposition', 'attachment;filename=' + 'img.jpg')
    res.setHeader('Content-Length', data.length)
    res.writeHead(200);
    res.end(Buffer.from(data, 'binary'));
    // res.send(canvasManager.image())
})

app.post('/image/generate', async (req, res)=>{
    const canvasManager = new CanvasManager(
        req.body.opts,
        req.body.fields,
    );
    // res.contentType('image/jpeg');
    // res.send(canvasManager.image())
    
    res.send({
        img: await canvasManager.image()
    })
})

app.listen(PORT, HOST, () => {
    console.log(`app listening at http://${HOST}:${PORT}`)
})
