document.addEventListener('DOMContentLoaded', ()=> {
    var shelfArr = [];
    bigShelf = document.getElementById("bigshelf");
    bigShelf.innerHTML = "";
    fetch('../data/test.csv')
        .then((res) => res.text())
        .then((text) => {
            blocks = text.split(',');
            makeShelf(blocks, shelfArr);
            bigShelf.innerHTML = shelfHTML(shelfArr, "beer");
        })
        .catch((e) => console.error(e));
});

function makeShelf(blocks, shelfArr) {
    while(blocks[0] !== undefined) {
        var sku = blocks.shift();
        var name = blocks.shift();
        var price = blocks.shift();
        var marked = blocks.shift();
        if(sku === undefined || name === undefined || price === undefined || marked === undefined) {
            break;
        }
        const item = new product(sku, name, price, marked);
        shelfArr.push(item);
    }
}

function TitleCase(string) {
    var words = string.split(" ");
    var title = "";
    while(words[0] !== undefined) {
        if(words[0] === "TJ" || words[0] === "IPA" || words[0] == "TJS") {
            title += words[0];
            words.shift();
            continue;
        }
        title += words[0][0] + words[0].slice(1).toLowerCase() + " ";
        words.shift();
    }
    return title;
}

function shelfHTML(shelfArr, aisle) {
    newText = ""
    for(index in shelfArr) {
        if(shelfArr[index].marked) {
            newText += '<div class = "marked product">';
        }
        else {
            newText += '<div class = "product">';
        }
        if(aisle === "wine") {
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