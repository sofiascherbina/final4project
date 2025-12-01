
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
                // loadMore.removeEventListener('click', showCharacters);
                // loadMore.addEventListener('click', ()=>{
                //     showFilteredCh()});  
            });
        });
});

let chList = document.querySelector('.ch-container');
let loadMore = document.querySelector('.load-more');
let template = null;
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
     const res = await fetchCharacters({ name: inputValue });
        renderCharacter(res.results || []);
},500));
function fetchCharacters(params = {}) {

    const param= new URLSearchParams();

    if (params.name) param.set('name', params.name);
    if (params.status && params.status !== '-') param.set('status', params.status);
    if (params.species && params.species !== '-')param.set('species', params.species);
    if (params.type && params.type !== '-') param.set('type', params.type);
    if (params.gender && params.gender !== '-') param.set('gender', params.gender);

    const url = new URL('https://rickandmortyapi.com/api/character')
    url.search = param.toString();
    return fetch(url)
    .then(res=>res.json());
}

async function showFilteredCh(){
    const statusValue = document.querySelector('#status').textContent.toLowerCase();
    const speciesValue = document.querySelector('#species').textContent.toLowerCase();
    const typeValue = document.querySelector('#type').textContent.toLowerCase();
    const genderValue = document.querySelector('#gender').textContent.toLowerCase();

    // let filtered = res.results.filter(ch => 
    //     (statusValue === 'all' || ch.status.toLowerCase().includes(statusValue)) &&
    //     (speciesValue === 'all' || ch.species.toLowerCase().includes(speciesValue)) &&
    //     (typeValue === 'all' || ch.type.toLowerCase().includes(typeValue)) &&
    //     (genderValue === 'all' || ch.gender.toLowerCase().includes(genderValue))
    // );
    const res = await fetchCharacters({
            status: statusValue,
            species: speciesValue,
            type: typeValue,
            gender: genderValue
        });
   renderCharacter(res.results);
    page++;
}
 showCharacters();
