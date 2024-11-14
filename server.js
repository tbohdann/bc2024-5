const express = require('express');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
program
  .option('-h, --host <host>', 'server address', 'localhost') 
  .option('-p, --port <port>', 'server port', 3000)           
  .option('-c, --cache <cacheDir>', 'path to cache directory', './cache'); 

program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.cache)) {
  fs.mkdirSync(options.cache, { recursive: true });  ї
}

const app = express();

app.get('/', (req, res) => {
  res.send('Server ok!');
});

app.listen(options.port, options.host, () => {
  console.log('Server is running at http://localhost:3000');
});
