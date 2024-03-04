document.addEventListener('DOMContentLoaded', ()=> {
    fetch('../text/current_wine.csv')
        .then((res) => res.text())
        then((text) => {
            console.log(text);
        })
        .catch((e) => console.error(e));
})

 //search button functions
 function skusearch(input) {
    console.log(input);
}

function namesearch(input) {
    console.log(input);
}