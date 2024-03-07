const express = require('express');
const fs = require('fs');

const app = express();

//database
var productMap = new Map;
var nameMap = new Map;
fs.readFile('public/data/products.csv', 'utf-8', function(err, data) {
    var lines = data.split(",,\r\n");
    while(typeof lines[0] !== 'undefined') {
        var line = lines.shift();
        var split = line.split(',');
        nameMap.set(split[1], split[0]);
        productMap.set(split[0], split.splice(1));
    }
    
    for(var [key, value] of nameMap) {
        console.log(key + " -> " + value);
    }
    
   console.log(nameMap.size);
});




//map
var skuMap = new Map();
var wineText;
fs.readFile('public/data/current_wine.csv', 'utf-8', (err, data) => {
    wineText = data;
    var lines = data.split("\n");
    lines.shift();
    while(typeof lines[0] !== 'undefined') {
        var line = lines.shift();
        var split = line.split(',');
        skuMap.set(split[0], split.splice(1));
    }
    /*
    for(var [key, value] of skuMap) {
        console.log(key + " -> " + value[0]);
    }
    */
});

app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.post('/home', (req, res) => {
    var searchValue = req.body.SKU;
    if(skuMap.has(searchValue)) {
        unmarkAll('public/data/current_wine.csv', wineText);
        mark('public/data/current_wine.csv', wineText, searchValue);
        res.render('wines', {title: 'Wines'});
    }
    else {
        //should inform the user that item was not found
        res.render('index', {title: 'Home'});
    }
});

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/home', (req, res) => {   
    res.render('index', {title: 'Home'});
});

app.get('/index', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/wines', (req, res) => {
    //unmarkAll('public/data/current_wine.csv', wineText);
    res.render('wines', {title: 'Wines'});
});

app.get('/beers', (req, res) => {
    res.render('beers', {title: 'Beers'});
});

app.get('/shelf', (req, res) => {
    res.render('shelf', {title: 'Shelf'});
});

app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});




//functions
function skusearch(input, wineText, map) {
    if(map.has(input)) {
        if(map.get(input)[1] === "wine") {
            //mark(wineText, input, 'data/test.csv');
            window.open("wines");
        }
        else if(map.get(input)[1] === "beer") {
            window.open("beers");
        }
        else {
            alert("aisle not found!");
        }
    }
    else {
        alert("input not found!");
    }
}

function mark(document, text, sku) {
    var outText = "";
    lines = text.split(/[\r\n]+/);
    while(typeof lines[0] !== 'undefined') {
        if(lines[0].slice(0,5) === sku) {
            lines[0] = lines[0].slice(0, -1) + '1';
        }
        outText += lines.shift() + "\n";
    }
    fs.writeFile(document, outText, (err) => {
        if(err) console.error(err);
    });
}

function unmarkAll(document, text) {
    var outText = "";
    var lines = text.split(/[\r\n]+/);
    outText += lines.shift() + "\n";
    while(typeof lines[0] !== 'undefined') {
        lines[0] = lines[0].slice(0, -1) + '0';
        var line = lines.shift() + "\n";
        outText += line;
    }
    fs.writeFile(document, outText, (err) => {
        if(err) console.error(err);
    });
}