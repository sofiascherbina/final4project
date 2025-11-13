let chList = document.querySelectorAll('.ch-text li h3');
let chImg = document.querySelector('.ch-img');
let timer = 0;
let srcArr = ['/img/mainCharacters/rick.png','/img/mainCharacters/morty.png','/img/mainCharacters/summer.png','/img/mainCharacters/beth.png','/img/mainCharacters/jerry.png'];
let bgArr = ['#A1D737','#0D171D','#DAF836','#A1D737','#0D171D'];

function updateCharacter() {
    chImg.classList.add('bg-up');

    chList.forEach((el, index) => {
        el.classList.add('ch-title');
        el.classList.remove('selected');
        if (index === timer) {
            el.classList.remove('ch-title');
            el.classList.add('selected');
        }
    });
     setTimeout(() => {
        chImg.classList.remove('bg-up');
        chImg.classList.add('bg-down');
        timer++;
         if (timer >= srcArr.length) {
        timer = 0;
    }
        setTimeout(() => {
            chImg.style.backgroundImage = `url("${srcArr[timer]}")`;
            chImg.style.backgroundColor = `${bgArr[timer]}`;
             chImg.classList.remove('bg-down');
        }, 1000); 
        
    }, 4000);
}
setInterval(updateCharacter, 5000);
updateCharacter();


let firstContEp = document.querySelector('.episodes-slider_list.first');
let secondContEp = document.querySelector('.episodes-slider_list.second');
 
function change() {
  setTimeout(() => {
    firstContEp.classList.add('secondMove');
    firstContEp.classList.remove('firstMove');
  }, 5000);
  setTimeout(()=>{
      firstContEp.classList.remove('secondMove');
    firstContEp.classList.add('firstMove');
  },5000);

}
change();
