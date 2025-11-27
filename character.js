
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
            });
        });
});


let chList = document.querySelector('.ch-container');
let loadMore = document.querySelector('.load-more');
let template = null;
let page = 1;

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
 showCharacters();