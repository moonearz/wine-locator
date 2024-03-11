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
    var lastLine = lines[lines.length - 1].split(',');
    var shelfNum = lastLine[0];
    var index = parseInt(lastLine[1]) + 1;
    lines.pop();
    console.log(shelfNum + ' ' + index);
    while(typeof(lines[0]) !== 'undefined') {
        split = lines[0].split(',');
        if(typeof(split[1]) === 'undefined') {
            break;
        }
        newHtml += '<form action="/shelf" method = "post">';
        newHtml += '<input type = "submit" value = "' + split[0] + ' ' + split[1] + ' ' + split[2] + '">';
        newHtml += '<input type = "hidden" id = "flag" name = "flag" value = "add">';
        newHtml += '<input type = "hidden" id = "sku" name = sku value = "' + split[0] + '">';
        newHtml += '<input type = "hidden" id = "shelfNum" name = shelfNum value =' + shelfNum + '>';
        newHtml += '<input type = "hidden" id = "index" name = index value =' + index + '>';
        newHtml += '</form>';
        lines.shift();
    }
    return newHtml;
}