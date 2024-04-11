window.onscroll = function() {headerChanger(), up()};

let Header = document.getElementById("sub-header");
let sticky = Header.offsetTop;

function headerChanger(){
    if (window.scrollY > sticky) {
        Header.classList.add("sticky");
      } else {
        Header.classList.remove("sticky");
      }
};


function abrirMenu(){
    let menuMobile = document.getElementById("mobil");
    menuMobile.classList.toggle("abrir");

    document.getElementById("icone").classList.toggle("fa-x");
    
};



function up(){
    let arrow = document.getElementById("arrowUP");

    if (window.scrollY > 1500) {
      arrow.classList.add("arrow_up");
    } else {
      arrow.classList.remove("arrow_up");
    }
}


