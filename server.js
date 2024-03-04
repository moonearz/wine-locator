const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let path = './';
    switch(req.url) {
        case '/':
            res.statusCode = 200;
            path += 'index.html';
            break;
        case '/wines':
            res.statusCode = 200;
            path += 'wines.html';
            break;
        case '/beers':
            res.statusCode = 200;
            path += 'beers.html';
            break;
        default:
            res.statusCode = 404;
            path += '404.html';
            break;
    }

    //set header
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(path, (err, data) => {
        if(err) {
            console.log(err);
            res.end();
        }
        else {
            res.end(data);
        }
    });
});

server.listen(3000, 'localhost', ()=> {
    console.log('listening');
});