document.addEventListener('DOMContentLoaded', ()=> {
    fetch('../data/wine_shelves.csv')
        .then((res) => res.text())
        .then((text) => {
            readWineShelves(text);
        })
        .catch((e) => console.error(e));
    //shelves are clickable
    var shelves = document.getElementsByClassName('shelf');

    function isNumeric(input) {
        return (input - 0) == input && (''+input).trim().length > 0;
    }

    function readWineShelves(text) {
        var lines = text.split("\n");
        for(var i = 0; i < 55; i++) {
            var line = lines.shift();
            if(typeof(line) === 'undefined') {
                continue;
            }
            var split = line.split(',');
            while(isNumeric(split[0])) {
                if(split[3] === '1') {
                    shelves[i].innerHTML += '<div class = "marked item">' + split[0] + '</div>';
                }
                else {
                    shelves[i].innerHTML += '<div class = "item">' + split[0] + '</div>';
                }
                for(var j = 0; j < 4; j++) {
                    split.shift();
                }
            }
        }
    }
})