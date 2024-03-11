const express = require('express');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');

app.listen(3000);

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.post('/wine', (req, res) => {
    var shelfNum = req.body.num;
    res.render('shelf', {title: 'Shelf ' + shelfNum});
});

app.post('/beer', (req, res) => {
    var shelfNum = req.body.num;
    res.render('shelf', {title: 'Shelf ' + shelfNum});
});

app.post('/shelf', (req, res) => {
    //data structures
    var productMap = new Map;
    var nameMap = new Map;
    var nameArr = [];
    //current shelves
    var Shelves = [];
    var shelfMap = new Map;
    var structures = loadData(nameMap, nameArr, productMap, shelfMap, Shelves);
    nameMap = structures[0];
    nameArr = structures[1];
    productMap = structures[2];
    shelfMap = structures[3];
    Shelves = structures[4];

    var sku = req.body.sku;
    var shelfNum = req.body.shelfNum;
    var index = parseInt(req.body.index) - 1;
    var flag = req.body.flag;
    var pname;
    if(typeof(req.body.pname) === 'undefined') {
        pname = "";
    }
    else {
        pname = req.body.pname.toUpperCase();
    }
    if(flag === "add") {
        if(shelfMap.has(sku) || index > Shelves[shelfNum].length || index < 0) {
            console.log("cant do this one");
            console.log(sku);
            console.log(index);
        }
        else {
            if(productMap.has(sku) && !shelfMap.has(sku)) {
                addItem(productMap, sku, Shelves, shelfNum, index);
                var writeText = writeShelves(Shelves); 
                fs.writeFileSync('public/data/shelves.csv', writeText);  
            }
            else if(shelfMap.has(sku)) {
                console.log("Error: sku already on shelves");
            }
            else {
                //make list of candidates
                var candidates = [];
                writeList(pname, candidates, nameArr, nameMap);
                //phony product with shelf information
                shelfInfo = new product(shelfNum, index, '0', '0');
                candidates.push(shelfInfo);
                fs.writeFileSync('public/data/results.csv', writeResults(candidates));
                return res.render('add', {title: 'Results'});
            }  
        } 
    }
    else if (flag === "delete") { 
        deleteItem(Shelves, shelfNum, index);
        writeText = writeShelves(Shelves); 
        fs.writeFileSync('public/data/shelves.csv', writeText); 
    }
    res.render('shelf', {title: 'Shelf ' + shelfNum});
});

app.get('/', (req, res) => {
    //data structures
    var productMap = new Map;
    var nameMap = new Map;
    var nameArr = [];
    //current shelves
    var Shelves = [];
    var shelfMap = new Map;
    var structures = loadData(nameMap, nameArr, productMap, shelfMap, Shelves);
    nameMap = structures[0];
    nameArr = structures[1];
    productMap = structures[2];
    shelfMap = structures[3];
    Shelves = structures[4];
    unmark(Shelves);
    var writeText = writeShelves(Shelves); 
    fs.writeFileSync('public/data/shelves.csv', writeText);
    res.render('index', {title: 'Home'});
});

app.get('/home', (req, res) => {   
    //data structures
    var productMap = new Map;
    var nameMap = new Map;
    var nameArr = [];
    //current shelves
    var Shelves = [];
    var shelfMap = new Map;
    var structures = loadData(nameMap, nameArr, productMap, shelfMap, Shelves);
    nameMap = structures[0];
    nameArr = structures[1];
    productMap = structures[2];
    shelfMap = structures[3];
    Shelves = structures[4];
    unmark(Shelves);
    var writeText = writeShelves(Shelves); 
    fs.writeFileSync('public/data/shelves.csv', writeText);
    res.render('index', {title: 'Home'});
});

app.get('/index', (req, res) => {
    //data structures
    var productMap = new Map;
    var nameMap = new Map;
    var nameArr = [];
    //current shelves
    var Shelves = [];
    var shelfMap = new Map;
    var structures = loadData(nameMap, nameArr, productMap, shelfMap, Shelves);
    nameMap = structures[0];
    nameArr = structures[1];
    productMap = structures[2];
    shelfMap = structures[3];
    Shelves = structures[4];
    unmark(Shelves);
    var writeText = writeShelves(Shelves); 
    fs.writeFileSync('public/data/shelves.csv', writeText);
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

app.get('/add', (req, res) => {
    res.render('add', {title: 'Results'});
});

app.get('/mark', (req, res) => {
    res.render('mark', {title: 'Results'});
});

app.post('/home', (req, res, next) => {
    //data structures
    var productMap = new Map;
    var nameMap = new Map;
    var nameArr = [];
    //current shelves
    var Shelves = [];
    var shelfMap = new Map;
    var structures = loadData(nameMap, nameArr, productMap, shelfMap, Shelves);
    nameMap = structures[0];
    nameArr = structures[1];
    productMap = structures[2];
    shelfMap = structures[3];
    Shelves = structures[4];

    var searchValue = req.body.SKU;
    var nameValue;
    if(typeof(req.body.pname) === 'undefined') {
        nameValue = req.body.pname;
    }
    else {
        nameValue = req.body.pname.toUpperCase();
    }
    if(typeof(searchValue) === 'undefined') {
        if(typeof(nameValue) === 'undefined' || nameValue.trim() === "") {
            return res.render('index', {title: 'Home'});
        }
        //make list of candidates
        var candidates = [];
        writeList(nameValue, candidates, nameArr, nameMap);
        fs.writeFileSync('public/data/results.csv', writeResults(candidates));
        return res.render('mark', {title: 'Results'});
    }
    else {
        if(shelfMap.has(searchValue)) {
            unmark(Shelves);
            mark(Shelves, shelfMap.get(searchValue)[0], shelfMap.get(searchValue)[1]);
        }
        else {
            unmark(Shelves);
            console.log("dont have this one")
            return res.render('home', {title: 'Home'})
        }   
        var writeText = writeShelves(Shelves); 
        fs.writeFileSync('public/data/shelves.csv', writeText);
    }
    if(shelfMap.get(searchValue)[0] > 54) {
        return res.render('beers', {title: "Beers"});
    }
    else {
        return res.render('wines', {title: 'Wines'});
    }
});

app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});

//functions
function loadData(nameMap, nameArr, productMap, shelfMap, Shelves) {
    var data = fs.readFileSync('public/data/products.csv', 'utf-8');
    var lines = data.split(",,\r\n");
    lines.shift();
    while(typeof(lines[0]) !== 'undefined') {
        var line = lines.shift();
        var split = line.split(',');
        var newPro = new product(split[0], split[1], split[2], '0');
        nameArr.push(split[1]);
        nameMap.set(split[1], newPro);
        productMap.set(split[0], newPro);
    }
    data = fs.readFileSync('public/data/shelves.csv', 'utf-8')
    Shelves = readShelves(data, shelfMap);
    return [nameMap, nameArr, productMap, shelfMap, Shelves]
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

function writeList(nameValue, candidates, nameArr, nameMap) {
    for(index in nameArr) {
        if(nameArr[index].includes(nameValue)) {
            candidates.push(nameMap.get(nameArr[index]))
        }
    }
}

function writeResults(candidates) {
    outText = "";
    for(index in candidates) {
        outText += candidates[index].sku + ',';
        outText += candidates[index].name + ',';
        outText += candidates[index].price;
        if(parseInt(index) < candidates.length - 1) {
            outText += "\n";
        }
    }
    return outText;
}

class product {
    constructor(sku, name, price, marked) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.marked = (marked === '1');
    }
}