const express = require('express');
const fs = require('fs');

const app = express();

//data structures
var productMap = new Map;
var nameMap = new Map;
var nameArr = [];
fs.readFile('public/data/products.csv', 'utf-8', function(err, data) {
    var lines = data.split(",,\r\n");
    lines.shift();
    while(typeof lines[0] !== 'undefined') {
        var line = lines.shift();
        var split = line.split(',');
        nameArr.push(split[1]);
        nameMap.set(split[1], split[0]);
        productMap.set(split[0], split.splice(1));
    }
    
    for(var [key, value] of nameMap) {
        //console.log(key + " -> " + value);
    }
   //console.log(nameMap.size);
});

//current shelves
var wineShelves = [];
var beerShelves = [];
var wineText;
fs.readFile('public/data/wine_shelves.csv', 'utf-8', (err, data) => {
    if(err) console.log(err);
    wineShelves = readWine(data);
    console.log(wineShelves);
    var writeText = writeWine(wineShelves);
    fs.writeFile('public/data/test2.csv', writeText, (err) => {
        if(err) {
            console.log(err);
        }
    });     
});



app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.post('/home', (req, res) => {
    var searchValue = req.body.SKU;
    var nameValue;
    if(typeof(req.body.pname) === 'undefined') {
        nameValue = req.body.pname;
    }
    else {
        nameValue = req.body.pname.toUpperCase();
    }
    if(typeof(searchValue) !== 'undefined') {
        if(skuMap.has(searchValue)) {
            unmarkAll('public/data/current_wine.csv', wineText);
            mark('public/data/current_wine.csv', wineText, searchValue);
            res.render('wines', {title: 'Wines'});
        }
        else {
            //should inform the user that item was not found
            res.render('index', {title: 'Home'});
        }
    }
    else {
        if(typeof (nameValue) !== 'undefined') {
            var candidates = [];
            for(index in nameArr) {
                if(nameArr[index].includes(nameValue)) {
                    candidates.push(nameArr[index]);
                }
            }
            //console.log(candidates);
        }
        res.render('index', {title: 'Home'});
    }
});

app.post('/shelf', (req, res) => {
    var shelfNum = req.body.num;
    res.render('shelf', {title: 'Shelf ' + shelfNum});
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

function writeWine(wineShelves) {
    var text = "";
    for(index1 in wineShelves) {
        for(index2 in wineShelves[index1]) {
            text += wineShelves[index1][index2].sku + ',';
            text += wineShelves[index1][index2].name + ',';
            text += wineShelves[index1][index2].price + ',';
            if(wineShelves[index1][index2].marked) {
                text += '1';
            }
            else {
                text += '0';
            }
            if(index2 + 1 !== wineShelves[index1].length) {
                text += ',';
            }
        }
        if(index1 + 1 < wineShelves.length) {
            text += '\n';
        }
    }
    return text;
}

function readWine(wineText) {
    var output = [];
    var shelves = wineText.split('\n');
    for(var i = 0; i < 55; i++) {
        if(typeof shelves[0] === 'undefined') {
            output.push([]);
            continue;
        }
        var nextShelf = [];
        nextLine = shelves[0].split(',');
        while(typeof(nextLine[0]) !== 'undefined') {
            var sku = nextLine.shift();
            var name = nextLine.shift();
            var price = nextLine.shift();
            var marked = nextLine.shift();
            //console.log(sku + ' ' + name + ' ' + price + ' ' + marked + "\n");
            if(typeof(sku) === 'undefined' || typeof(name) === 'undefined' || typeof(price) === 'undefined' || typeof(marked) === 'undefined') {
                break;
            }
            nextItem = new product(sku, name, price, marked);
            nextShelf.push(nextItem);
        }
        output.push(nextShelf);
        shelves.shift();
    }
    return output;
}

class product {
    constructor(sku, name, price, marked) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.marked = (marked === '1');
    }
}