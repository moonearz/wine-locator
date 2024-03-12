document.addEventListener('DOMContentLoaded', ()=> {
    var shelfArr = [];
    var index = getIndex();
    bigShelf = document.getElementById("bigshelf");
    bigShelf.innerHTML = "";
    fetch('../data/shelves.csv')
        .then((res) => res.text())
        .then((text) => {
            var blocks = text.split(/[\r\n]+/);
            for(var i = 0; i < index; i++) {
                blocks.shift();
            }
            makeShelf(blocks[0], shelfArr);
            bigShelf.innerHTML = shelfHTML(shelfArr, index);
        })
        .catch((e) => console.error(e));
});

function getIndex() {
    var title = document.title;
    var index = title.length - 1;
    while(isNumeric(title[index])) {
        index--;
    }
    return title.slice(index + 1);
}

function isNumeric(input) {
    return (input - 0) == input && (''+input).trim().length > 0;
}

function makeShelf(block, shelfArr) {
    if(typeof(block) === 'undefined') {
        return;
    }
    var blocks = block.split(',');
    blocks.shift();
    while(typeof(blocks[0]) !== 'undefined') {
        var sku = blocks.shift();
        var name = blocks.shift();
        var price = blocks.shift();
        var marked = blocks.shift();
        if(typeof(sku) === 'undefined' || typeof(name) === 'undefined' || typeof(price) === 'undefined' || typeof(marked) === 'undefined') {
            break;
        }
        const item = new product(sku, name, price, marked);
        shelfArr.push(item);
    }
}

function TitleCase(string) {
    var words = string.split(" ");
    var title = "";
    while(typeof(words[0]) !== 'undefined') {
        if(words[0] === "TJ" || words[0] === "IPA" || words[0] == "TJS") {
            title += words[0] + ' ';
            words.shift();
            continue;
        }
        title += words[0][0] + words[0].slice(1).toLowerCase() + " ";
        words.shift();
    }
    return title;
}

function shelfHTML(shelfArr, shelfNum) {
    console.log(shelfArr);
    newText = ""
    var counter = 0;
    for(index in shelfArr) {
        newText += '<div class = "product">';
        newText += '<form action="/shelf" method = "post" class = "deleteform">';
        newText += '<input type = "submit" class = "deletebutton" value = "X">';
        newText += '<input type = "hidden" id = "flag" name = "flag" value = "delete">';
        newText += '<input type = "hidden" id = "index" name = index value =' + (counter + 1) + '>';
        newText += '<input type = "hidden" id = "shelfNum" name = shelfNum value =' + shelfNum + '>';
        newText += '</form>';
        if(shelfNum < 55 || shelfNum > 69) {
            newText += '<div class = "bottle"> </div>';
        }
        else {
            newText += '<div class = "can"> </div>';
        }
        newText += '<div class = "tag">';
        newText += '<div class = "name">' + TitleCase(shelfArr[index].name) + '</div>';
        if(shelfArr[index].marked) {
            newText += '<div class = "marked price">';
        }
        else {
            newText += '<div class = "price">';
        }
        newText += '<p>' + shelfArr[index].price.toLowerCase() + '</p>';
        newText += '</div>';
        newText += '</div>';
        newText += '</div>';
        counter++;
    }
    if(newText === "") {
        newText = '<h2> This shelf is empty </h2>';
    }
    newText += '<form action="/shelf" class = "addbutton" method = "post">' + "<div class = 'miniheader'>Add an item to this shelf, index required</div> <br><br>";
    newText += '<label for = "skud"> SKU: </label>';
    newText += '<input type = "text" id = "skud" name = "sku"><br>';
    newText += '<label for = "pnamed"> Product Name: </label>';
    newText += '<input type = "text" id = "pnamed" name = "pname"><br>';
    newText += '<label for = "indexd"> Index (nth from the left): </label>';
    newText += '<input type = "text" id = "indexd" name = "index" required><br><br>';
    newText += '<input type = "submit">';
    newText += '<input type = "hidden" id = "flag" name = "flag" value = "add">';
    newText += '<input type = "hidden" id = "shelfNum" name = shelfNum value =' + shelfNum + '>';
    newText += '</form>';
    return newText;
}


class product {
    constructor(sku, name, price, marked) {
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.marked = (marked === '1');
    }
}