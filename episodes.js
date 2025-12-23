let selectorArr = document.querySelectorAll('.selector-cont');
selectorArr.forEach(el=>{
    let list = el.querySelector('.selector-list');
    let selectorText = el.querySelector('.selector');
    let listEl = el.querySelectorAll('.selector-list-el');
    selectorText.addEventListener('click',()=>{
        if(list.style.display === 'block'){
            list.style.display = 'none';
        }
        else{
             list.style.display = 'block';
        }
});
    listEl.forEach(li =>{
        let season = li.querySelector('.season');
        let seriesCont = li.querySelector('.series-list');
        let seriesList = li.querySelectorAll('.series-list li');
        season.addEventListener('click',()=>{
            const seasonValue = season.querySelector('.season-num').textContent.trim();
            selectorText.textContent = `${seasonValue} season`;
            if(seasonValue === 'All season'){
                selectorText.textContent = `${seasonValue}`;
                epList.innerHTML = '';
                page = 1;
                showEpisodes();
                return
            }
            showFilteredEp(seasonValue);
        if(seriesCont.style.display === 'block'){
            seriesCont.style.display = 'none';
        }
        else{
             seriesCont.style.display = 'block';
        }
        seriesList.forEach(el=>{
            el.addEventListener('click',()=>{
                const seriesValue = el.querySelector('.ser-num').textContent.trim();
                selectorText.textContent = `${season.textContent} : ${el.textContent}`;
                showFilteredSer(seasonValue,seriesValue);
                list.style.display = 'none';
            });
        })
        });
    });
});
let epModal = basicLightbox.create(` <div class="modal-ep">
            <button class="close-ep"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 5.5L5.5 16.5" stroke="#A1D737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.5 5.5L16.5 16.5" stroke="#A1D737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="modap-ep-content"></div>
            </div>`);

let epModalCont = epModal.element();
let btnCloseEp = epModalCont.querySelector('.close-ep');
let epModalcontent = epModalCont.querySelector('.modap-ep-content');

btnCloseEp.addEventListener('click', ()=>{
    epModal.close();
});

let epList = document.querySelector('.episodes-cont');
let loadMore = document.querySelector('.ep-more');
let template = null;
let modalTemplate = null;
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
function formatEpisodeNumber(num) {
    return num < 10 ? `0${num}` : `${num}`;
}

async function showFilteredSer(seasonNumber,seriesNumber){
    try{
        const res = await fetchEpisodes({
            episode: `S0${seasonNumber}E${formatEpisodeNumber(seriesNumber)}`
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
async function templateEpReady(){
    let temp = await fetch('epModal.hbs');
    let res = await temp.text();
    modalTemplate = Handlebars.compile(res); 
}
async function fetchTargetId(id) {
    let res = await fetch(`https://rickandmortyapi.com/api/episode/${id}`);
    return res.json();
}
async function fetchCh(urls){
    let urlChArr = urls.slice(0,4);
    let chPromises = urlChArr.map(async (url) =>{
        let res= await fetch(url);
        return await res.json();
    });
    return await Promise.all(chPromises);
}
function renderModalEp(ep){
    const markup = modalTemplate(ep);
    epModalcontent.insertAdjacentHTML('beforeend', markup);
}
async function openModalEp(id){
    if (!modalTemplate) await templateEpReady();
    epModalcontent.innerHTML = ''; 
    let targetEp = await fetchTargetId(id);
    targetEp.characters = await  fetchCh(targetEp.characters);
    renderModalEp(targetEp);
}
epList.addEventListener('click', async (event)=>{
    let targetLi = event.target.closest('.ep-el');
    let targetId = targetLi.dataset.episodeId;
    epModal.show();
    await openModalEp(targetId);
});
showEpisodes();