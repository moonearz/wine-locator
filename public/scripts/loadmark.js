document.addEventListener('DOMContentLoaded', ()=> {
    var list = document.getElementById('list');
    var header = document.getElementById('header');
    fetch('../data/results.csv')
        .then((res) => res.text())
        .then((text) => {
            list.innerHTML = readResults(text);
            if(list.innerHTML === "") {
                header.innerHTML = "Sorry! No results found.";
            }
        })
        .catch((e) => console.error(e));
});

function readResults(text) {
    var lines = text.split("\n");
    var newHtml = "";
    console.log(lines);
    while(typeof(lines[0]) !== 'undefined') {
        split = lines[0].split(',');
        if(typeof(split[1]) === 'undefined') {
            break;
        }
        newHtml += '<form action ="/home" method = "POST">';
        newHtml += '<input type = "hidden" id = "sku" name = "SKU" value = "' + split[0] + '">';
        newHtml += '<input type = "submit" value = "' + split[0] + ' ' + split[1] + ' ' + split[2] + '">';
        newHtml += '</form>';
        lines.shift();
    }
    return newHtml;
}