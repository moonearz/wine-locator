const express = require('express');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
/*anything behind the scenes here*/
app.use((req, res, next) => {
    /* TESTING FILE WRITING
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
            var newPro = new product(split[0], split[1], split[2], '0');
            nameArr.push(split[1]);
            nameMap.set(split[1], newPro);
            productMap.set(split[0], newPro);
        }
        
        for(var [key, value] of nameMap) {
            //console.log(key + " -> " + value.price);
        }
    //console.log(nameMap.size);
    });
    //current shelves
    var Shelves = [];
    fs.readFile('public/data/shelves.csv', 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
        }
        Shelves = readShelves(data);
        mark(Shelves, 20, 0);
        var writeText = writeShelves(Shelves);
        //console.log(writeText);
        fs.writeFile('public/data/shelves.csv', writeText, (err) => {
            if(err) {
                console.log(err);
            }
        });     
    });
    */
    next();
});

app.post('/home', (req, res) => {
    var searchValue = req.body.SKU;
    var nameValue;
    if(typeof(req.body.pname) === 'undefined') {
        nameValue = req.body.pname;
    }
    else {
        nameValue = req.body.pname.toUpperCase();
    }
    if(typeof(searchValue) === 'undefined') {
        //make list of candidates
        var candidates = [];
        writeList(candidates);
    }
    else {
        var Shelves = [];
        var shelfMap = new Map;
        fs.readFile('public/data/shelves.csv', 'utf-8', (err, data) => {
            if(err) {
                console.log(err);
            }
            Shelves = readShelves(data, shelfMap);
            if(shelfMap.has(searchValue)) {
                unmark(Shelves);
                mark(Shelves, shelfMap.get(searchValue)[0], shelfMap.get(searchValue)[1]);
                var writeText = writeShelves(Shelves); 
                fs.writeFile('public/data/shelves.csv', writeText, (err) => {   
                if(err) {
                    console.log(err);
                }
                });  
            }
            else {
                unmark(Shelves);
                var writeText = writeShelves(Shelves); 
                fs.writeFile('public/data/shelves.csv', writeText, (err) => {   
                if(err) {
                    console.log(err);
                }
                }); 
                console.log("dont have this one")
            }   
        });
    }
    res.render('wines', {title: 'Wines'});
});

app.post('/wine', (req, res) => {
    var shelfNum = req.body.num;
    res.render('shelf', {title: 'Shelf ' + shelfNum});
});

app.post('/beer', (req, res) => {
    var shelfNum = req.body.num;
    res.render('shelf', {title: 'Shelf ' + shelfNum});
});

app.post('/shelf', (req, res) => {
    var sku = req.body.sku;
    var shelfNum = req.body.shelfNum;
    var index = req.body.index;
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
            var newPro = new product(split[0], split[1], split[2], '0');
            nameArr.push(split[1]);
            nameMap.set(split[1], newPro);
            productMap.set(split[0], newPro);
        }
    });
    var Shelves = [];
    var shelfMap = new Map;
    fs.readFile('public/data/shelves.csv', 'utf-8', (err, data) => {
        if(err) {
            console.log(err);
        }
        Shelves = readShelves(data, shelfMap);
        if(shelfMap.has(sku) || (parseInt(index) > Shelves[shelfNum].length) || parseInt(index) < 0) {
            console.log("already have this one");
        }
        else {
            addItem(productMap, sku, Shelves, shelfNum, index);
            var writeText = writeShelves(Shelves); 
            fs.writeFile('public/data/shelves.csv', writeText, (err) => {
            if(err) {
                console.log(err);
            }
        });  
        }   
    });
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
    res.render('wines', {title: 'Wines'});
});

app.get('/beers', (req, res) => {
    res.render('beers', {title: 'Beers'});
});

app.get('/shelf', (req, res) => {
    res.render('shelf', {title: 'Shelf'});
});

app.get('/help', (req, res) => {
    res.render('help', {title: 'Help'});
});

app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});




//functions
function skusearch(map, input) {
    /*      
    structure:
    1. make hash table of items on shelves
    2. check if sku is in table
    3. record shelf and index of each item for easy marking
    4. mark if item is found
    */
}

function writeShelves(Shelves) {
    var text = "";
    for(var index1 = 0; index1 < 84; index1++) {
        text += index1;
        if(Shelves[index1].length > 0) {
            text += ',';
        }
        for(var index2 in Shelves[index1]) {
            text += Shelves[index1][index2].sku + ',';
            text += Shelves[index1][index2].name + ',';
            text += Shelves[index1][index2].price + ',';
            if(Shelves[index1][index2].marked) {
                text += '1';
            }
            else {
                text += '0';
            }
            if(parseInt(index2) !== (Shelves[index1].length - 1)) {
                text += ',';
            }
        }
        if(index1 + 1 < Shelves.length) {
            text += '\n';
        }
    }
    return text;
}

function readShelves(shelfText, shelfMap) {
    var shelfNum = 0;
    var index = 0;
    var output = [];
    var shelves = shelfText.split('\n');
    for(var i = 0; i < 84; i++) {
        if(typeof shelves[0] === 'undefined') {
            shelves.shift();
            output.push([]);
            continue;
        }
        var nextShelf = [];
        nextLine = shelves[0].split(',');
        nextLine.shift();
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
            shelfMap.set(sku, [shelfNum, index]);
            index++;
        }
        index = 0;
        output.push(nextShelf);
        shelves.shift();
        shelfNum++;
    }
    return output;
}

function unmark(Shelves) {
    for(index1 in Shelves) {
        for(index2 in Shelves[index1]) {
            Shelves[index1][index2].marked = false;
        }
    }
}

function mark(Shelves, index1, index2) {
    if(Shelves[index1].length < (index2 + 1)) {
        return;
    }
    else {
        Shelves[index1][index2].marked = true;
    }
}

function addItem(products, sku, Shelves, shelfNum, index) {
    Shelves[shelfNum].splice(index, 0, products.get(sku));
}

function deleteItem(Shelves, shelfNum, index) {
    Shelves[shelfNum].splice(index, 1);
}

function removeItem(Shelves, shelfNum, index) {

}

function writeList(candidates) {
    outText = "";
}

class product {
    constructor(sku, name, price, marked) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.marked = (marked === '1');
    }
}