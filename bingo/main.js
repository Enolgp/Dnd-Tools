var data = []
var windowWidth = '';
var line = false;
var lineSound = new Audio('./sounds/line-fanfare.mp3');
var bingoSound = new Audio('./sounds/bingo-fanfare.mp3');

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
}

// Create a new cell with the parameters
function createCell(id, content, size='s') {
    const newCell = document.createElement('div');
    if(size=='s'){
        newCell.classList.add('col-md-4', 'border', 'text-center', 'p-5', 'cell');
    }else if(size=='m'){
        newCell.classList.add('col-md-6', 'border', 'text-center', 'p-5', 'cell');
    }else{
        newCell.classList.add('col-md-12', 'border', 'text-center', 'p-5', 'cell');
    }
    newCell.id = id;
    newCell.textContent = content;

    newCell.addEventListener('click', () => {
        applyFlipAndGray(newCell);
        checkBingo();
    });

    return newCell;
}

function checkBingo(){
    let cells=Array.from(document.getElementsByClassName('cell'));
    let results = [];
    
    cells.forEach(function(cell){
        if(cell.classList.contains('flipped')) results.push(1);
        else results.push(0);
    })
    
    //check if the bingo has occured
    if(!results.includes(0)) showResultConten('Acabas de cantar bingo');

    //check if a line has occured if not happend before
    if(!line){
        let group1 = results[0] == results[1] && results[1] == results[2] && results[0] == 1;
        let group2 = results[3] == results[4] && results[4] == results[5] && results[3] == 1;
        let group3 = results[6] == results[7] && results[7] == results[8] && results[6] == 1;

        if (group1 || group2 || group3){
            showResultConten('Acabas de cantar línea');
            line = true;
        }
    }
}

function showResultConten(text){
    document.getElementById('modal-notification').innerText = text;
    // $('#modal-notification').textContent = text;
    $('#notification-modal').modal('toggle');

    if(!line) lineSound.play();
    else bingoSound.play();
}

async function loadCells(n){
    try {
        const container = document.getElementById('cell-container');
        let shuffledData = shuffleArray(data);

        let size='s';
        if(n==1){
            size = 'b';
        }else if (n==2){
            size = 'm';
        }

        for (let i = 0; i < n; i++) {
            let cell = createCell(i, shuffledData[i], size);
            container.appendChild(cell);
        }

        setCellColor();

    } catch (error) {
        console.error('Error loading cells:', error);
    }
}

function setCellColor(){
    let cells=document.getElementsByClassName('cell');
    for(let i = 0; i < cells.length; i++){
        // remove cells[i] class c1 or c2
        cells[i].classList.remove('c1', 'c2');
        if (windowWidth == 'sm'){
            if(i >= 3 && i < 6) cells[i].classList.add('c1');
            else cells[i].classList.add('c2');
        }else if (windowWidth == 'md'){
            if (i % 2) {
                cells[i].classList.add('c1');
            } else {
                cells[i].classList.add('c2');
            }
        }
    }
}


function setCookie(name, value) {
    let v = value;
    if(Array.isArray(value)){
        v = JSON.stringify(value);
    }
    document.cookie = name + "=" + (v || "") + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            let value = c.substring(nameEQ.length, c.length);
            try {
                arr = JSON.parse(value);
                if(arr.length === 0){
                    return null
                }
                return arr
            } catch (e) {
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

//create de cookie UI
function createCookieUI(arr){
    let currentData = document.getElementById('current-data');
    for(let i=0; i<arr.length;i++){
        let cell = createCookieCell(arr[i]);
        currentData.appendChild(cell);
    }
}

function createCookieCell(content){
    let card = document.createElement('div');
    card.className = 'card';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex justify-content-between align-items-center';
    
    let textContent = document.createElement('div');
    textContent.className = 'text-content';
    textContent.textContent = content;

    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button btn btn-danger';
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
    cardBody.appendChild(textContent);
    cardBody.appendChild(deleteButton);
    card.appendChild(cardBody);

    deleteButton.addEventListener('click', function() {
        card.remove();
    });

    return card;
}

function addCookieCell(txt){
    if(txt.trim() !== ''){
        let currentData = document.getElementById('current-data');
        let cell = createCookieCell(txt);
        currentData.appendChild(cell)
    }
}

function saveCookieData(){
    let cardBodies = document.querySelectorAll('#current-data > .card > .card-body > .text-content');
    let content = [];
    cardBodies.forEach(textDiv =>{
        content.push(textDiv.textContent.trim());
    });
    setCookie('bingoData', content);
}

function uploadButton(){
    let cookieInput = document.getElementById('cookie-input');
    addCookieCell(cookieInput.value);
    cookieInput.value='';
}

// Stablish the Bingo sheet
document.addEventListener('DOMContentLoaded', async () => {
    //set the window with variable
    if(window.innerWidth < 756) windowWidth='sm'
    else windowWidth = 'md'

    // get the data from cookies
    if(getCookie('bingoData')==null){
        // if there isnt cookie, fetch it from API
        data = await fetchData();
        setCookie('bingoData', data);
    }else{
        data=getCookie('bingoData')
    }

    document.getElementById('upload-button').addEventListener('click', uploadButton);

    document.getElementById('cookie-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            uploadButton();
        }
    });

    document.getElementById('save-cookies').addEventListener('click', function() {
        uploadButton();
        saveCookieData();
        $('#property-modal').modal('hide');
        location.reload();
    });

    document.getElementById('del-cookies').addEventListener('click', function(){
        eraseCookie('bingoData');
        document.getElementById('current-data').innerHTML = '';
    });

    createCookieUI(data)

    if (data.length < 3){
        loadCells(data.length)
    }else if(data.length >= 3 && data.length < 6){
        loadCells(3)
    }else if(data.length >= 6 && data.length < 9){
        loadCells(6)
    }else{
        loadCells(9)
    }
});

window.addEventListener('resize', function(event) {
    if(this.window.innerWidth <= 768 && windowWidth == 'md'){
        windowWidth = 'sm';
        setCellColor();
    }else if(this.window.innerWidth > 768 && windowWidth == 'sm'){
        windowWidth = 'md';
        setCellColor();
    }
}, true);

// next step: code comments and git explanation