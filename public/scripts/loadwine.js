document.addEventListener('DOMContentLoaded', ()=> {
    //shelves are clickable
    var shelves = document.getElementsByClassName('shelf');
    for(var i = 0; i < shelves.length; i++) {
        shelves[i].addEventListener('click', 
            function() {
                mark(this);
            }
        );
    }

    function mark(element) {
        element.classList.add('marked');
    }
})