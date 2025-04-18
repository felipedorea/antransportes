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

let accordion1 = document.getElementById("title1").addEventListener("click", () => {
  document.getElementById("chevron1").classList.toggle("chevron");
  document.getElementById("content1").classList.toggle("active");
})

let accordion2 = document.getElementById("title2").addEventListener("click", () => {
  document.getElementById("chevron2").classList.toggle("chevron");
  document.getElementById("content2").classList.toggle("active");
})

let accordion3 = document.getElementById("title3").addEventListener("click", () => {
  document.getElementById("chevron3").classList.toggle("chevron");
  document.getElementById("content3").classList.toggle("active");
})

let accordion4 = document.getElementById("title4").addEventListener("click", () => {
  document.getElementById("chevron4").classList.toggle("chevron");
  document.getElementById("content4").classList.toggle("active");
})

let accordion5 = document.getElementById("title5").addEventListener("click", () => {
  document.getElementById("chevron5").classList.toggle("chevron");
  document.getElementById("content5").classList.toggle("active");
})


