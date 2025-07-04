let btn__description = document.getElementById('btn__description');
let text = document.getElementById('text');

btn__description.addEventListener('mouseover', function () {
    text.classList.toggle('active');
});

btn__description.addEventListener('mouseout', function () {
    text.classList.remove('active');
});

let temas = document.querySelectorAll('.tema__item');
let link = document.getElementById('theme__link');

temas.forEach(item => {
    item.addEventListener('click', () => {
        let nombreTema = item.textContent.trim().toLowerCase().replace(/\s+/g, '');
        link.href = `css/${nombreTema}.css`;     
    });
});
