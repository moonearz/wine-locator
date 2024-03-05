document.addEventListener('DOMContentLoaded', ()=> {
    fetch('../data/current_wine.csv')
        .then((res) => res.text())
        .then((text) => {
            readShelves(text);
        })
        .catch((e) => console.error(e));
    //shelves are clickable
    var shelves = document.getElementsByClassName('shelf');
    for(var i = 0; i < shelves.length; i++) {
        shelves[i].addEventListener('click', 
            function() {
                zoom(this);
            }
        );
    }

    function zoom(element) {
        
    }

    function isNumeric(input) {
        return (input - 0) == input && (''+input).trim().length > 0;
    }

    function readShelves(text) {
        var lines = text.split("\n");
        while(typeof lines[0] !== 'undefined') {
            var line = lines.shift();
            var split = line.split(',');
            if(isNumeric(split[4])) {
                var index = parseInt(split[4]) + 5 * parseInt(split[5]);
                if(split[7] === '1') {
                    shelves[index].innerHTML += '<div class = "marked item">' + split[0] + '</div>';
                }
                else {
                    shelves[index].innerHTML += '<div class = "item">' + split[0] + '</div>';
                }
            }
            else {
                var index = -1;
            }
        }
    }
})