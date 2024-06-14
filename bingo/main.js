// Change a color into the same but grayer
// Cambiar a escala de grises
function rgbToGrayscale(r, g, b) {
    r = Math.max(r - 120, 0); // Reducir rojo
    g = Math.max(g - 120, 0); // Reducir verde
    b = Math.max(b - 120, 0); // Reducir azul

    // Construir el nuevo color en formato RGB
    return `rgb(${r}, ${g}, ${b})`;
}

// Función para aplicar flip y cambio de color
function applyFlipAndGray(cell) {
    if (!cell.classList.contains('flipped')) { // Asegura que solo se ejecute una vez
        cell.classList.add('flipped'); // Marca la celda como flipped

        // Aplicar flip-forward
        cell.classList.add('flip-forward');

        setTimeout(() => {
            // Cambiar el color de fondo a escala de grises
            const style = window.getComputedStyle(cell);
            const bgColor = style.backgroundColor;
            const [r, g, b] = bgColor.match(/\d+/g).map(Number);
            cell.style.backgroundColor = rgbToGrayscale(r, g, b);
            cell.classList.add('text-white');

            // Aplicar flip-backward después de cambiar el color
            setTimeout(() => {
                cell.classList.remove('flip-forward');
                cell.classList.add('flip-backward');
            }, 10); // Añadir un pequeño retardo para aplicar flip-backward después de cambiar el fondo
        }, 300); // Tiempo igual a la duración de la animación forward
    }
}

// Create a new cell with 
function createCell(id, content) {
    const newCell = document.createElement('div');
    newCell.classList.add('col-sm-4', 'border', 'text-center', 'p-5', 'cell');
    newCell.id = id;
    newCell.textContent = content;

    // Agregar evento click
    newCell.addEventListener('click', () => {
        applyFlipAndGray(newCell);
    });

    return newCell;
}

// Stablish the Bingo sheet
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cell-container');
    for (let i=1; i<=9 ;i++){
        let cell = createCell(i,i)
        if(i%2)
            cell.classList.add('c1')
        else
            cell.classList.add('c2')
        container.appendChild(cell)
    }
});