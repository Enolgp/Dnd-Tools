
// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Change a color into the same but darker
function rgbToGrayscale(r, g, b) {
    r = Math.max(r - 120, 0);
    g = Math.max(g - 120, 0);
    b = Math.max(b - 120, 0);

    return `rgb(${r}, ${g}, ${b})`;
}

// Flip the card and change color
function applyFlipAndGray(cell) {
    if (!cell.classList.contains('flipped')) { 
        cell.classList.add('flipped'); 

        cell.classList.add('flip-forward');

        setTimeout(() => {
            const style = window.getComputedStyle(cell);
            const bgColor = style.backgroundColor;
            const [r, g, b] = bgColor.match(/\d+/g).map(Number);
            cell.style.backgroundColor = rgbToGrayscale(r, g, b);
            cell.classList.add('text-white');

            setTimeout(() => {
                cell.classList.remove('flip-forward');
                cell.classList.add('flip-backward');
            }, 10); 
        }, 300); 
    }
    cell.classList.remove("cell");
}

// Create a new cell with the parameters
function createCell(id, content) {
    const newCell = document.createElement('div');
    newCell.classList.add('col-sm-4', 'border', 'text-center', 'p-5', 'cell');
    newCell.id = id;
    newCell.textContent = content;


    newCell.addEventListener('click', () => {
        applyFlipAndGray(newCell);
    });

    return newCell;
}

// Stablish the Bingo sheet
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cell-container');
    maxLength = data.length
    let shuffledData=shuffleArray(data.slice())
    for (let i=0; i<=maxLength ;i++){
        let cell = createCell(i,data[i])
        if(i%2)
            cell.classList.add('c1')
        else
            cell.classList.add('c2')
        container.appendChild(cell)
    }
});