window.onscroll = function() {headerChanger()};

let Header = document.getElementById("sub-header");
let sticky = Header.offsetTop;
console.log(sticky);

function headerChanger(){
    if (window.scrollY > sticky) {
        Header.classList.add("sticky");
      } else {
        Header.classList.remove("sticky");
      }
}


function abrirMenu(){
    let menuMobile = document.getElementById("mobil");
    menuMobile.classList.toggle("abrir");

    document.getElementById("icone").classList.toggle("fa-x");
    
};


