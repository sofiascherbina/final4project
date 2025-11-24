
let selectorArr = document.querySelectorAll('.selector-cont');
selectorArr.forEach(el=>{
    let list = el.querySelector('.selector-list');
    let selectorText = el.querySelector('.selector');
    let listEl = el.querySelectorAll('.selector-list li');
    selectorText.addEventListener('click',()=>{
        list.style.display = 'block';
});
    listEl.forEach(li =>{
            li.addEventListener('click',()=>{
                selectorText.textContent = li.textContent;
                list.style.display = 'none';  
            });
        });
});
