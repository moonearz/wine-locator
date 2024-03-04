const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log("request made");

    //set header
    res.setHeader('Content-Type', 'text/html');
    fs.readFile('index.html', (err, data) => {
        if(err) {
            console.log(err);
            res.end();
        }
        else {
            console.log("here");
            res.write(data);
            res.end();
        }
    });
});

server.listen(3000, 'localhost', ()=> {
    console.log('listening');
});