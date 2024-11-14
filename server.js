const { program } = require('commander')
const { exit } = require('process')
const express = require('express')
const path = require('path')
const fs = require('fs')

const bodyParser = require('body-parser')
const multer = require('multer')

program
    .option('-h, --host <host>', 'server address', 'localhost') 
    .option('-p, --port <port>', 'server port', 3000)           
    .option('-c, --cache <cacheDir>', 'path to cache directory', './cache'); 

program.parse();

const options = program.opts();

if(!options.host) {
    console.error("Please enter host");
    exit(1);
}
if(!options.port) {
    console.error("Please enter port");
    exit(1);
}
if(!options.cache) {
    console.error("Enter path to cache directory");
    exit(1);
}

const app = express()
app.use(bodyParser.text());
app.use(multer().none());


app.get('/', function (req, res) {
    res.send('server ok!')
})

app.get('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(options.cache, `${noteName}.txt`);

    fs.readFile(notePath, 'utf8', (err, data) => {
        if(err) 
            res.status(404).send('Note not found');
        res.status(200).send(data)
    })
})

app.put('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(options.cache, `${noteName}.txt`);
    const noteContent = req.body;

    if(!fs.existsSync(notePath)) return res.status(404).send('Note not found');
    
    fs.writeFile(notePath, noteContent, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err });
        }

        res.status(201).send('Note created');
    });
})

app.delete('/notes/:name', (req, res) => {
    const noteName = req.params.name;
    const notePath = path.join(options.cache, `${noteName}.txt`);

    fs.unlink(notePath, (err) => {
        if(err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404).end('Note not found');
            } else {
                res.status(500).json({ message: 'Server error', error })
            }
        }
        else {
            res.writeHead(200).end('Note delete');
        }
    })
})



app.listen(options.port, options.host, () => {
  console.log(`Server is running at http://${options.host}:${options.port}`);
});
