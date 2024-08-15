import { convertirSpeechHtml, convertirHtmlToString, rellenarFechaInput } from './utils.js';

function searchSpeechForTitle (speechs, title) {    
    return speechs.find(speech => speech.title.toLowerCase().includes(title.toLowerCase()));

}

function addEvenlistenerSearchSpeech (speechs) {
    const searchInput = document.querySelector('.search-input');

    searchInput.addEventListener('input', () => {
        console.log('input', searchInput.value);
        if (searchInput.value.length >= 3) {
            const speech = searchSpeechForTitle(speechs, searchInput.value);
            if (speech) {
                insertSpeechs([speech], speech.category);
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
    const filteredSpeechs = speechs.filter(speech => speech.category === category);

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
}

document.addEventListener('DOMContentLoaded', loadJSON);
