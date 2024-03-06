const express = require('express');
const fs = require('fs');
const csv = require('jquery-csv');

const app = express();

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
    outText += lines.shift() + "\n";
    outText = outText.trim();
    fs.writeFile(document, outText, (err) => {
        if(err) console.error(err);
    });
}

function unmark(document, text) {
    var outText = "";
    lines = text.split(/[\r\n]+/);
    while(typeof lines[0] !== 'undefined') {
        lines[0] = lines[0].slice(0, -1) + '0';
        outText += lines.shift() + "\n";
    }
    outText += lines.shift() + "\n";
    outText = outText.trim();
    fs.writeFile(document, outText, (err) => {
        if(err) console.error(err);
    });
}