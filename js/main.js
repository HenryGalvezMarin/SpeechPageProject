function clickCopySpeech() {
    const speechs = document.querySelectorAll('.speech');
    const alertCopyText = document.querySelector('.alert-copy-text');
    speechs.forEach(speech => {
        speech.addEventListener('click', () => {
            const speechText = speech.querySelector('p').textContent;
            navigator.clipboard.writeText(speechText);
            alertCopyText.classList.add('show');
            const main = document.querySelector('main');
            main.classList.add('show');
            setTimeout(() => {
                alertCopyText.classList.remove('show');
                main.classList.remove('show');
            }, 1000);         
        });
    }
    );
}

function insertSpeechs(speechs) {
    const speechsContainer = document.querySelector('.speechs-container');
    const categoriesButtons = document.querySelectorAll('.category-button');

    categoriesButtons.forEach(button => {
        button.addEventListener('click', () => {
            speechsContainer.innerHTML = '';
            const category = button.textContent;
            const filteredSpeechs = speechs.filter(speech => speech.category === category);
            filteredSpeechs.forEach(speech => {
                const speechElement = document.createElement('div');
                speechElement.classList.add('speech');
                speechElement.innerHTML = `                    
                    <p>${speech.speech}</p>                    
                `;
                speechsContainer.appendChild(speechElement);
            });
            clickCopySpeech();
        });
    });

}

function insertData(data) {
    const categoriesContainer = document.querySelector('.categories-container');
    const categories = data.categories;
    const speechs = data.speechs;

    categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList.add('category-button');
        categoryButton.textContent = category;
        categoriesContainer.appendChild(categoryButton);
    });

    insertSpeechs(speechs);

    const firstCategoryButton = document.querySelector('.category-button');
    firstCategoryButton.click();    
}


async function loadJSON() {
    const response = await fetch('./data/data.json');
    const data = await response.json();
    insertData(data);
}

document.addEventListener('DOMContentLoaded', () => {
    loadJSON();
});