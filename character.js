
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
    const characters = await fetchCharacter(page);
    renderCharacter(characters.results);
    page++;
    // filterArr.forEach(op=>{
    //     op.addEventListener('click',showFilteredCh);
    // })
}
loadMore.addEventListener('click', showCharacters);
function fetchCharacter(page){
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
}
searchCh.addEventListener('input', _.debounce(async ()=>{
    let inputValue = searchCh.value.trim().toLowerCase();
    chList.innerHTML = '';
    if(inputValue === ''){
        page = 1;
        showCharacters();
        return 
    }
    if(!template) await templateReady();
    const data = await fetch('https://rickandmortyapi.com/api/character');
    const res = await data.json();
    let filter = res.results.filter(ch => ch.name.toLowerCase().includes(inputValue));
    renderCharacter(filter);
},500));
async function showFilteredCh(){
     if(!template) await templateReady();
    const data = await fetch('https://rickandmortyapi.com/api/character');
    const res = await data.json();
    const statusValue = document.querySelector('#status').textContent.toLowerCase();
    const speciesValue = document.querySelector('#species').textContent.toLowerCase();
    const typeValue = document.querySelector('#type').textContent.toLowerCase();
    const genderValue = document.querySelector('#gender').textContent.toLowerCase();

    let filtered = res.results.filter(ch => 
        (statusValue === 'all' || ch.status.toLowerCase().includes(statusValue)) &&
        (speciesValue === 'all' || ch.species.toLowerCase().includes(speciesValue)) &&
        (typeValue === 'all' || ch.type.toLowerCase().includes(typeValue)) &&
        (genderValue === 'all' || ch.gender.toLowerCase().includes(genderValue))
    );
    console.log(filtered);
    renderCharacter(filtered);
}
 showCharacters();
