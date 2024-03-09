document.addEventListener('DOMContentLoaded', ()=> {
    fetch('../data/shelves.csv')
        .then((res) => res.text())
        .then((text) => {
            readBeerShelves(text);
        })
        .catch((e) => console.error(e));
    var shelves = document.getElementsByClassName('beershelf');

    function isNumeric(input) {
        return (input - 0) == input && (''+input).trim().length > 0;
    }

    function readBeerShelves(text) {
        var lines = text.split("\n");
        for(var i = 0; i < 55; i++) {
            lines.shift();
        }
        for(var i = 55; i < 85; i++) {
            var line = lines.shift();
            if(typeof(line) === 'undefined') {
                continue;
            }
            var split = line.split(',');
            split.shift();
            while(isNumeric(split[0])) {
                if(split[3] === '1') {
                    shelves[i - 55].innerHTML += '<div class = "marked item">' + split[0] + '</div>';
                }
                else {
                    shelves[i - 55].innerHTML += '<div class = "item">' + split[0] + '</div>';
                }
                for(var j = 0; j < 4; j++) {
                    split.shift();
                }
            }
        }
    }
});