const WebSocket = require('ws');
const fs = require('fs');
const server = new WebSocket.Server({port: 3000});

function readFile(path) {
  return new Promise((res,rej) => {
    fs.readFile(`${path}`, 'utf-8', function(error, data) {
      data ? res(data) : rej(error)
    })
  })
}

server.on('connection', ws => {
  readFile('data.json')
  .then(data => ws.send(data));
  ws.on('message', message => {
    fs.writeFile('data.json', message, () => {
      console.log("Записано!");
    });
  })
})
readFile('data.json');
