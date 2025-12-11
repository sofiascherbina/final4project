let selectorArr = document.querySelectorAll('.selector-cont');
selectorArr.forEach(el=>{
    let list = el.querySelector('.selector-list');
    let selectorText = el.querySelector('.selector');
    let listEl = el.querySelectorAll('.selector-list li');
    selectorText.addEventListener('click',()=>{
        if(list.style.display === 'block'){
            list.style.display = 'none';
        }
        else{
             list.style.display = 'block';
        }
});
    listEl.forEach(li =>{
        let season = li.querySelector('p');
        let seriesCont = li.querySelector('.series-list');
        let seriesList = li.querySelectorAll('.series-list li');
        season.addEventListener('click',()=>{
            selectorText.textContent = season.textContent;
        if(seriesCont.style.display === 'block'){
            seriesCont.style.display = 'none';
        }
        else{
             seriesCont.style.display = 'block';
        }
        seriesList.forEach(el=>{
            el.addEventListener('click',()=>{
                selectorText.textContent = `${season.textContent} : ${el.textContent}`;
                list.style.display = 'none';
            });
        })
        });
    });
});

let epList = document.querySelector('.episodes-cont');
let loadMore = document.querySelector('.ep-more');
let template = null;
let page = 1;

async function templateReady() {
    let temp = await fetch('episodes.hbs');
    let res = await temp.text();
    template = Handlebars.compile(res);
}
async function showEpisodes() {
    if (!template) await templateReady();
    const episodes = await paginEpisodes(page);
    renderEpisodes(episodes.results);
    page++;
}
loadMore.addEventListener('click',showEpisodes);
function paginEpisodes(page){
    const params = new URLSearchParams({
        page : page
    });
    const url = new URL('https://rickandmortyapi.com/api/episode');
    url.search = params.toString();
    return fetch(url)
    .then(res => res.json());
}
function renderEpisodes(epArr){
    const markup = template({episodes: epArr});
    epList.insertAdjacentHTML('beforeend', markup);
    let epListArr = document.querySelectorAll('.episodes-cont li');
    if(epListArr.length < 19){
            loadMore.style.display='none';
    }
    else if(epListArr.length >= 19) {
        loadMore.style.display='block';
    }
}
showEpisodes();