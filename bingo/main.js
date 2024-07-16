var data = []

// URL of the data
const apiUrl = 'https://my-json-server.typicode.com/enolgp/api/element';

// Fetch the data
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const file = await response.json();

        if (Array.isArray(file)) {
            let fetchedData =  file.map(item => item.data);
            return fetchedData

        } else {
            throw new Error('JSON response format is incorrect or missing "element" array');
        }
    } catch (error) {
        console.error('Error fetching the data:', error);
    }
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Change a color into the same but darker
function rgbToGrayscale(r, g, b, scale=120) {
    return `rgb(${r-scale}, ${g-scale}, ${b-scale})`;
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

async function loadCells(n){
    try {
        const container = document.getElementById('cell-container');
        let shuffledData = shuffleArray(data);

        for (let i = 0; i < n; i++) {
            let cell = createCell(i, shuffledData[i]);
            if (i % 2) {
                cell.classList.add('c1');
            } else {
                cell.classList.add('c2');
            }
            container.appendChild(cell);
        }
    } catch (error) {
        console.error('Error loading cells:', error);
    }
}

function setCookie(name, value) {
    let v = value;
    if(Array.isArray(value)){
        v = JSON.stringify(value);
    }
    document.cookie = name + "=" + (v || "") + "; path=/";
}

function getCookie(name){
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0){
            let value = c.substring(nameEQ.length, c.length);
            try{
                return JSON.parse(value);
            }catch(e){
                return value;
            }
        }
    }
    return null;
}

// Function to delete a cookie by name
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/';
}

// Stablish the Bingo sheet
document.addEventListener('DOMContentLoaded', async () => {
    let all_cookies = document.cookie;
    eraseCookie("bingoData")
    if(getCookie('bingoData')==null){
        data=fetchData();
        console.log(data)
        setCookie('bingoData', data);
    }else{
        data=getCookie('bingoData')
    }
    console.log("cookies: " + all_cookies)
    await console.log("cookies: " + all_cookies)
    // loadCells(9)
});