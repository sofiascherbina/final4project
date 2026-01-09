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


window.addEventListener("load", async () => {
    if (document.fonts?.ready) await document.fonts.ready;

    const marquee = document.querySelector(".episodes-slider");
    const track = document.querySelector(".episodes-slider-moving-line");
    const group = document.querySelector(".episodes-slider_container");
    if (!marquee || !track || !group) return;

    [...track.querySelectorAll(".episodes-slider_container")].slice(1).forEach(n => n.remove());

   
    while (track.scrollWidth < marquee.clientWidth * 2) {
      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }

    let w = Math.round(group.scrollWidth);   
    let x = 0;

    const pxPerSec = 100; 
    let last = performance.now();

    function loop(now) {
      const dt = (now - last) / 500; 
      last = now;

      x -= pxPerSec * dt;

      if (x <= -w) x += w;
      track.style.transform = `translate3d(${Math.round(x)}px,0,0)`;

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    window.addEventListener("resize", () => {
      w = Math.round(group.scrollWidth);
      x = 0;
    });
  });
let arrowBtn = document.querySelector(".arrow-btn");
arrowBtn.addEventListener('click',()=>{
  if(arrowBtn.getAttribute("href") === "#footer"){
    arrowBtn.setAttribute("href", "#common-header");
    arrowBtn.classList.add('arrow-down');
    arrowBtn.classList.remove('arrow-up');
  }
  else if (arrowBtn.getAttribute("href") === "#common-header" || arrowBtn.getAttribute("href") === "#"){
    arrowBtn.setAttribute("href", "#footer");
    arrowBtn.classList.add('arrow-up');
    arrowBtn.classList.remove('arrow-down');
  }
});
let chContainer = document.querySelector('.render-character');
let template = null;
let page = 1;
let search = document.querySelector('.search');
async function templateReady() {
    let temp = await fetch('characters.hbs');
    let res = await temp.text();
    template = Handlebars.compile(res);
}
async function renderCharacter(chArr){
  if (!template) await templateReady();
    const markup = template({characters: chArr});
    chContainer.insertAdjacentHTML('beforeend', markup);
}
async function fetchCharacters(params = {}) {

    const param= new URLSearchParams();
    if (params.name) param.set('name', params.name);

    const url = new URL('https://rickandmortyapi.com/api/character')
    url.search = param.toString();
    let res = await fetch(url);
    if(!res.ok){
        throw res
    }
    return res.json();
}
search.addEventListener('input', _.debounce(async ()=>{
    let inputValue = search.value.trim().toLowerCase();;
    chContainer.innerHTML = '';
    if(inputValue === ''){
        page = 1;
        chContainer.innerHTML = '';
        return 
    }
     try {
        const res = await fetchCharacters({ name: inputValue });
        renderCharacter(res.results);

    } catch (err) {
        chContainer.innerHTML = `
            <div class="error">
                <div class="error-pic"></div>
                <p class="error-text">Oops! Try looking for something else...</p>
            </div>`;
    }
},500));

   window.addEventListener("load", async () => {
    if (document.fonts?.ready) await document.fonts.ready;

    const marquee = document.querySelector(".marquee");
    const track = document.querySelector(".moving-line-tack");
    const group = document.querySelector(".moving-line-container");
    if (!marquee || !track || !group) return;

    [...track.querySelectorAll(".moving-line-container")].slice(1).forEach(n => n.remove());

   
    while (track.scrollWidth < marquee.clientWidth * 2) {
      const clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }

    let w = Math.round(group.scrollWidth);   
    let x = 0;

    const pxPerSec = 100; 
    let last = performance.now();

    function loop(now) {
      const dt = (now - last) / 1000; 
      last = now;

      x -= pxPerSec * dt;

      if (x <= -w) x += w;
      track.style.transform = `translate3d(${Math.round(x)}px,0,0)`;

      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    window.addEventListener("resize", () => {
      w = Math.round(group.scrollWidth);
      x = 0;
    });
  });