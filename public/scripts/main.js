document.addEventListener('DOMContentLoaded', ()=> {
    //search button click cues
    var skuInput = document.getElementById("sku");
    var nameInput = document.getElementById("pname");
    document.getElementById('skuButton').addEventListener('click', 
        function () {
            skusearch(skuInput.value, skuMap);
        }
    )
    document.getElementById('nameButton').addEventListener('click', 
        function () {
            namesearch(nameInput.value, skuMap);
        }
    )

    //make current sku hash table
    var skuMap = new Map();
    fetch('../text/current_wine.csv')
        .then((res) => res.text())
        .then((text) => {
            CSVtoHash(text, skuMap);
        })
        .catch((e) => console.error(e));
        
})

function CSVtoHash(text, map) {
    var lines = text.split("\n");
    while(typeof lines[0] !== 'undefined') {
        var line = lines.shift();
        var split = line.split(',');
        map.set(split[0], split.splice(1));
    }
    /*
    for(var [key, value] of map) {
        console.log(key + " -> " + value[0]);
    }
    */
}

 //search button functions
 function skusearch(input, map) {
    if(map.has(input)) {
        if(map.get(input)[1] === "wine") {
            window.open("wines")
        }
        else if(map.get(input)[1] === "beer") {
            window.open("beers")
        }
        else {
            alert("aisle not found!")
        }
    }
    else {
        alert("input not found!");
    }
}

function namesearch(input, map) {
    console.log(input);
}

//marking/unmarking functions
function mark(url, sku) {
    
}

function unmark(url, sku) {

}
