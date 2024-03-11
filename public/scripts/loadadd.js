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

}