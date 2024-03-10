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
    for(index in shelfArr) {
        if(shelfArr[index].marked) {
            newText += '<div class = "marked product">';
        }
        else {
            newText += '<div class = "product">';
        }
        if(shelfNum < 55) {
            newText += '<div class = "bottle"> </div>';
        }
        else {
            newText += '<div class = "can"> </div>';
        }
        newText += '<div class = "tag">';
        newText += '<p class = "name">' + TitleCase(shelfArr[index].name) + '</p>';
        newText += '<div class = "price">';
        newText += '<p>' + shelfArr[index].price.toLowerCase() + '</p>';
        newText += '</div>';
        newText += '</div>';
        newText += '</div>';
    }
    if(newText === "") {
        newText = '<h2> This shelf is empty </h2>';
    }
    newText += '<form action="/shelf" class = "addbutton" method = "post">' + "Add an item to this shelf <br><br>";
    newText += '<label for = "sku"> SKU or Product Name: </label>';
    newText += '<input type = "text" id = "sku" name = "sku" required><br>';
    newText += '<label for = "index"> Index (nth from the left): </label>';
    newText += '<input type = "text" id = "index" name = "index" required><br>';
    newText += '<input type = "submit">';
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