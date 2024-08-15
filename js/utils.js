export function convertirSpeechHtml(speech) {
    
    let copySpeech = speech;
    let speechElement = document.createElement('div');
    let speechElementText = document.createElement('div');
    
    if (typeof speech === 'string') {
        copySpeech = [speech];
    }

    
    copySpeech.forEach((speech) => {
        speech = speech.replace(/\[\[INPUTNOMBRE\]\]/g, '<input placeholder="Nombre">');
        speech = speech.replace(/\[\[FECHA\]\]/g, '<input placeholder="Fecha">');
        speech = speech.replace(/\[\[BR\]\]/g, '');
                
        let p = document.createElement('p');
        p.innerHTML = speech;
        speechElementText.appendChild(p);
    });

    speechElement.appendChild(speechElementText);

    return `
        ${speechElement.innerHTML}
        <button class="copy-button">📋</button>
    `;
}

export function convertirHtmlToString(html) {
    // Verificar que el argumento sea un elemento HTML
    if (!(html instanceof HTMLElement)) {
        throw new Error('El argumento proporcionado no es un elemento HTML válido.');
    }

    // Clonar el nodo para evitar modificar el original
    const clonedHtml = html.cloneNode(true);

    // Reemplazo de valores usando un solo recorrido del DOM
    clonedHtml.querySelectorAll('input').forEach(input => {
        const placeholder = input.getAttribute('placeholder');
        if (placeholder === 'Nombre' || placeholder === 'Fecha') {
            const valor = input.value.trim() || (placeholder === 'Nombre' ? 'NOMBRE' : 'FECHA');
            input.replaceWith(document.createTextNode(valor));
        }
    });

    // Eliminación de etiquetas html innecesarias conservando el texto con sus saltos de línea
    const htmlString = clonedHtml.innerHTML
        .replace(/<br>/g, '\n')
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n')
        .replace(/<input.*>/g, '');
    
    return htmlString;
}

export function rellenarFechaInput(speech) {
    // cuando se escriba en un input de placeholder "Fecha" solo acepta numeros y al escribir 2 numeros se agrega un guion automaticamente y despues de escribir 4 numeros se agrega otro guion y despues el año de 4 digitos (validaciòn)
    const fechaInput = speech.querySelector('input[placeholder="Fecha"]');
    const alertErrorText = document.querySelector('.alert-error-text');

    if (!fechaInput) return;

    fechaInput.addEventListener('input', () => {
        const valor = fechaInput.value;

        //Validar que la fecha no tenga mas de 10 caracteres
        if (valor.length >= 10) {
            fechaInput.value = valor.slice(0, 10);
            return;
        }

        //Validar que los  dos primeros digitos sean dias validos
        if (valor.length === 2) {
            if (valor > 31) {
                fechaInput.value = valor.slice(0, 1);                            
                alertErrorText.innerHTML = '<p>❌ El día no puede ser mayor a 31!!</p>';
                alertErrorText.classList.add('show');
                setTimeout(() => {
                    alertErrorText.classList.remove('show');
                }, 1000);
                return;
            }
        }

        //Validar que el 4to y 5to digito sean meses validos
        if (valor.length === 5) {
            if (valor.slice(3, 5) > 12) {
                fechaInput.value = valor.slice(0, 4);
                alertErrorText.innerHTML = '<p>❌ El mes no puede ser mayor a 12!!</p>';
                alertErrorText.classList.add('show');
                setTimeout(() => {
                    alertErrorText.classList.remove('show');
                }, 1000);
                return;
            }
        }

        const valorLimpio = valor.replace(/\D/g, '');

        fechaInput.value = valorLimpio
            .replace(/^(\d{2})(\d)/, '$1/$2')
            .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');

    });

}