import { convertirSpeechHtml, convertirHtmlToString, rellenarFechaInput } from './utils.js';

function menuMobile() {
    const menuButton = document.querySelector('.menu-bar');
    const menu = document.querySelector('.categories-container');
    const closeMenu = document.querySelector('.close-menu-bar');

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('show');
        closeMenu.classList.toggle('show');
    });

    closeMenu.addEventListener('click', () => {
        menu.classList.remove('show');
        closeMenu.classList.remove('show');
    });
}

function searchSpeechForText (speechs, text) {        
    let speechFinded = [];
    speechs.forEach(speech => {
        let speechCopy = speech.speech;
        if (typeof speechCopy === 'string') {
            speechCopy = [speechCopy];
        }
        let speechTitle = speech.title;
        speechTitle = speechTitle.toLowerCase();
        speechCopy.forEach((speechText) => {            
            speechText = speechText.toLowerCase();
            text = text.toLowerCase();
            if (speechText.includes(text) || speechTitle.includes(text)) {
                speechFinded.push(speech);
            }
        });
    });    
    return speechFinded;
}

function addEvenlistenerSearchSpeech (speechs) {
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('input', () => {
        if (searchInput.value.length >= 3) {
            const speechsSearch = searchSpeechForText(speechs, searchInput.value);
            if (speechsSearch) {
                insertSpeechs(speechsSearch, 'Busqueda');
            }
        }
    });
}

function clickCopySpeech() {
    const alertCopyText = document.querySelector('.alert-copy-text');
    const main = document.querySelector('main');

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('copy-button')) {
            const speech = event.target.closest('.speech');
            const speechText = speech.querySelector('div');

            navigator.clipboard.writeText(convertirHtmlToString(speechText));

            alertCopyText.classList.add('show');
            main.classList.add('show');
            setTimeout(() => {
                alertCopyText.classList.remove('show');
                main.classList.remove('show');
            }, 1000);
        }
    });
}

function insertSpeechs(speechs, category) {
    const speechsContainer = document.querySelector('.speechs-container');
    speechsContainer.innerHTML = ''; // Limpiar contenido previo

    const fragment = document.createDocumentFragment(); // Usar fragmento para inserciones eficientes
    let filteredSpeechs = [];
    if (category === 'Busqueda') {
        filteredSpeechs = speechs;
    } else {
        filteredSpeechs = speechs.filter(speech => speech.category === category);
    }
    filteredSpeechs.forEach(speech => {
        const speechElement = document.createElement('div');
        speechElement.classList.add('speech');
        speechElement.innerHTML = convertirSpeechHtml(speech.speech);
        fragment.appendChild(speechElement);
        rellenarFechaInput(speechElement);
    });

    speechsContainer.appendChild(fragment);
}

function insertData(data) {
    const categoriesContainer = document.querySelector('.categories-container');
    const fragment = document.createDocumentFragment();
    const menu = document.querySelector('.categories-container');
    const closeMenu = document.querySelector('.close-menu-bar');

    // Crear botones de categoría
    data.categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList.add('category-button');
        categoryButton.textContent = category;
        fragment.appendChild(categoryButton);
    });

    categoriesContainer.appendChild(fragment);

    // Asignar evento a botones de categoría
    categoriesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('category-button')) {
            insertSpeechs(data.speechs, event.target.textContent);
            menu.classList.toggle('show');            
            closeMenu.classList.remove('show');
        }
    });

    // Simular clic en el primer botón para cargar la primera categoría
    categoriesContainer.querySelector('.category-button').click();
}

async function loadJSON() {
    const response = await fetch('./data/data.json');
    const data = await response.json();
    insertData(data);
    addEvenlistenerSearchSpeech(data.speechs);
    clickCopySpeech(); // Activar funcionalidad de copiar texto
    menuMobile(); // Activar menú móvil
}

document.addEventListener('DOMContentLoaded', loadJSON);
