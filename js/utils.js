export function convertirSpeechHtml(speech) {
    let speechHtml = speech.speech.replace(/\[\[INPUT\]\]/g, '<input placeholder="Nombre">');
    speechHtml = speechHtml.replace(/\[\[FECHA\]\]/g, '<input placeholder="Fecha">');
    return `
        <p>${speechHtml}</p>
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

    // Eliminación de etiquetas html innecesarias
    const htmlString = clonedHtml.textContent;

    return htmlString;
}