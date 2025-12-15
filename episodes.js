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
            const seasonValue = season.querySelector('.season-num').textContent.trim();
            selectorText.textContent = `${seasonValue} season`;
            showFilteredEp(seasonValue);
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
let searchEp = document.querySelector('.search-ep');

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
        epArr = epArr.map(ep => ({
        ...ep,
        episode: ep.episode.slice(2, 3)
    }));
    let epListArrPrevent = document.querySelectorAll('.episodes-cont li').length;
    const markup = template({episodes: epArr});
    epList.insertAdjacentHTML('beforeend', markup);
    let epListArr = document.querySelectorAll('.episodes-cont li');
    let epListArrNew = Array.from(epListArr).slice(epListArrPrevent);
    epListArrNew.forEach((season,index)=>{
        if(epArr[index].episode === '1'){
            season.classList.add('first-season');
        }
        else if(epArr[index].episode === '2'){
            season.classList.add('second-season');
        }
        else if(epArr[index].episode === '3'){
            season.classList.add('third-season');
        }
        else if(epArr[index].episode === '4'){
            season.classList.add('fourth-season');
        }
        else if(epArr[index].episode === '5'){
            season.classList.add('fifth-season');
        }
    });
    if(epListArr.length < 19){
            loadMore.style.display='none';
    }
    else if(epListArr.length >= 19) {
        loadMore.style.display='block';
    }
}
searchEp.addEventListener('input', _.debounce(async ()=>{
    let inputValue = searchEp.value.trim().toLowerCase();
    epList.innerHTML = '';
    if(inputValue === ''){
        page = 1;
        showEpisodes();
        return 
    }
    try{
        const res = await fetchEpisodes({ name: inputValue });
        renderEpisodes(res.results);
    }
    catch{
        epList.innerHTML = `
        <div class="error">
            <div class="error-pic"></div>
            <p class="error-text" >Oops! Try looking for something else...</p>
        </div>`;
        loadMore.style.display='none';
    } 
},500));
async function fetchEpisodes(params = {}) {

    const param= new URLSearchParams();

    if (params.name) param.set('name', params.name);
    if (params.episode && params.episode !== 'All season') param.set('episode', params.episode);

    const url = new URL('https://rickandmortyapi.com/api/episode')
    url.search = param.toString();
    let res = await fetch(url);
    if(!res.ok){
        throw res
    }
    return res.json();
}
async function showFilteredEp(seasonNumber){
    try{
        const res = await fetchEpisodes({
            episode: `S0${seasonNumber}`
        });
        epList.innerHTML = '';
        renderEpisodes(res.results);
        page++;
    }
    catch{
        epList.innerHTML = `
        <div class="error">
            <div class="error-pic"></div>
            <p class="error-text" >Oops! Try looking for something else...</p>
        </div>`;
        loadMore.style.display='none';
    }
}
showEpisodes();