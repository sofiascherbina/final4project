
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
            li.addEventListener('click',()=>{
                selectorText.textContent = li.textContent;
                list.style.display = 'none';
                chList.innerHTML = '';
                showFilteredCh();
            });
        });
});

let chModal = basicLightbox.create(` <div class="modal-ch">
            <button class="close-ch"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 5.5L5.5 16.5" stroke="#A1D737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.5 5.5L16.5 16.5" stroke="#A1D737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="modap-ch-content"></div>
            </div>`);

let chModalCont = chModal.element();
let btnCloseCh = chModalCont.querySelector('.close-ch');
let chModalcontent = chModalCont.querySelector('.modap-ch-content');

btnCloseCh.addEventListener('click', ()=>{
    chModal.close();
});

let chList = document.querySelector('.ch-container');
let loadMore = document.querySelector('.load-more');
let template = null;
let modalTemplate = null;
let page = 1;
let searchCh = document.querySelector('.search-ch');
let filterArr = document.querySelectorAll('.selector');

async function templateReady() {
    let temp = await fetch('characters.hbs');
    let res = await temp.text();
    template = Handlebars.compile(res);
}
async function showCharacters(){
    if (!template) await templateReady();
    const characters = await paginCharacter(page);
    renderCharacter(characters.results);
    page++;
}
loadMore.addEventListener('click', showCharacters);
function paginCharacter(page){
    const params = new URLSearchParams({
        page: page,
    });
    const url = new URL('https://rickandmortyapi.com/api/character')
    url.search = params.toString();
    return fetch(url)
    .then(res=>res.json());
}

function renderCharacter(chArr){
    const markup = template({characters: chArr});
    chList.insertAdjacentHTML('beforeend', markup);
    let chListArr = document.querySelectorAll('.ch-container li');
    if(chListArr.length < 19){
            loadMore.style.display='none';
    }
    else if(chListArr.length >= 19) {
        loadMore.style.display='block';
    }
}

searchCh.addEventListener('input', _.debounce(async ()=>{
    let inputValue = searchCh.value.trim().toLowerCase();
    chList.innerHTML = '';
    if(inputValue === ''){
        page = 1;
        showCharacters();
        return 
    }
    try{
        const res = await fetchCharacters({ name: inputValue });
        renderCharacter(res.results);
    }
    catch{
        chList.innerHTML = `
        <div class="error">
            <div class="error-pic"></div>
            <p class="error-text" >Oops! Try looking for something else...</p>
        </div>`;
        loadMore.style.display='none';
    }
     
},500));

async function fetchCharacters(params = {}) {

    const param= new URLSearchParams();

    if (params.name) param.set('name', params.name);
    if (params.status && params.status !== '-') param.set('status', params.status);
    if (params.species && params.species !== '-')param.set('species', params.species);
    if (params.type && params.type !== '-') param.set('type', params.type);
    if (params.gender && params.gender !== '-') param.set('gender', params.gender);

    const url = new URL('https://rickandmortyapi.com/api/character')
    url.search = param.toString();
    let res = await fetch(url);
    if(!res.ok){
        throw res
    }
    return res.json();
}

async function showFilteredCh(){
    const statusValue = document.querySelector('#status').textContent.toLowerCase();
    const speciesValue = document.querySelector('#species').textContent.toLowerCase();
    const typeValue = document.querySelector('#type').textContent.toLowerCase();
    const genderValue = document.querySelector('#gender').textContent.toLowerCase();
    try{
        const res = await fetchCharacters({
            status: statusValue,
            species: speciesValue,
            type: typeValue,
            gender: genderValue
        });
        renderCharacter(res.results);
        page++;
    }
    catch{
        chList.innerHTML = `
        <div class="error">
            <div class="error-pic"></div>
            <p class="error-text" >Oops! Try looking for something else...</p>
        </div>`;
        loadMore.style.display='none';
    }
}
async function templateChReady(){
    let temp = await fetch('chModal.hbs');
    let res = await temp.text();
    modalTemplate = Handlebars.compile(res); 
}
async function fetchTargetId(id) {
    let res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    return res.json();
}
async function fetchEp(urls){
    let urlEpArr = urls.slice(0,5);
    let epPromises = urlEpArr.map(async (url) =>{
        let res= await fetch(url);
        return await res.json();
    });
    return await Promise.all(epPromises);
}
function renderModalCh(ch){
    ch.episodes = ch.episodes.map(ep=>({
        ...ep,
        episode : ep.episode.slice(2,3) 
    }));
    const markup = modalTemplate(ch);
    chModalcontent.insertAdjacentHTML('beforeend', markup);
}
async function openModalCh(id){
    if (!modalTemplate) await templateChReady();
    chModalcontent.innerHTML = ''; 
    let targetCh = await fetchTargetId(id);
    targetCh.episodes = await fetchEp(targetCh.episode);
    renderModalCh(targetCh);
}
chList.addEventListener('click', async (event)=>{
    let targetLi = event.target.closest('.ch-el');
    let targetId = targetLi.dataset.characterId;
    chModal.show();
    await openModalCh(targetId);
});
 showCharacters();
