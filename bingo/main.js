var data = []
var windowWidth = '';
var line = false;
var lineSound = new Audio('/Dnd-Tools/bingo/sounds/line-fanfare.mp3');
var bingoSound = new Audio('/Dnd-Tools/bingo/sounds/bingo-fanfare.mp3');

// URL of the data
const apiUrl = 'https://my-json-server.typicode.com/enolgp/api/element';

// Fetch the data asynchronously
async function fetchData() {
    try {
        // fetch the data from the API
        const response = await fetch(apiUrl);
        
        // Throw error if the response is not ok
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const file = await response.json();

        // Map the data and return it if the data is an array
        if (Array.isArray(file)) {
            let fetchedData =  file.map(item => item.data);
            return fetchedData

        } else {
            // Throw error if the json format is not an array
            throw new Error('JSON response format is incorrect or missing "element" array');
        }
    } catch (error) {
        // Throw error if the fetch failed
        console.error('Error fetching the data:', error);
    }
}

// Function to shuffle array passed as an argument
function shuffleArray(array) {
    // go through the loop in reverse
    for (let i = array.length - 1; i > 0; i--) {
        // create a random j index
        const j = Math.floor(Math.random() * (i + 1));
        // Swap the elements in the position i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Change a color into the same but darker based on a scale.
// Need the R, G, B values as parameters, the scale is optional
// Scale default = 120
function rgbToDarker(r, g, b, scale=120) {
    return `rgb(${r-scale}, ${g-scale}, ${b-scale})`;
}

// Animation to flip the cell and change its color
// it needs the cell passed by argument
function applyFlipAndGray(cell) {
    // Check if the cell is already flipped
    if (!cell.classList.contains('flipped')) { 
        // add the flipped class
        cell.classList.add('flipped'); 
        // starts the animation
        cell.classList.add('flip-forward');

        // add a delay to change the color
        setTimeout(() => {
            // get the cell data
            const style = window.getComputedStyle(cell);
            const bgColor = style.backgroundColor;
            const [r, g, b] = bgColor.match(/\d+/g).map(Number);
            // change the background to darker and the text to white
            cell.style.backgroundColor = rgbToDarker(r, g, b);
            cell.classList.add('text-white');

            // flip the cell again to the begining after a short delay
            setTimeout(() => {
                cell.classList.remove('flip-forward');
                cell.classList.add('flip-backward');
            }, 10);
        }, 300); 
    }
    cell.classList.remove("cell")
}

// Create a new cell with id and content passed in the parameters.
// Aditionally you can change the size of the cell
// Return the cell element
function createCell(id, content, size='s') {
    const newCell = document.createElement('div');
    //change the side of the cell based on the number of cells
    if(size=='s'){
        newCell.classList.add('col-md-4', 'border', 'text-center', 'p-5', 'cell');
    }else if(size=='m'){
        newCell.classList.add('col-md-6', 'border', 'text-center', 'p-5', 'cell');
    }else{
        newCell.classList.add('col-md-12', 'border', 'text-center', 'p-5', 'cell');
    }
    newCell.id = id;
    newCell.textContent = content;

    // Add the event to flip the cell and check if the bingo happens
    newCell.addEventListener('click', () => {
        applyFlipAndGray(newCell);
        checkBingo();
        setCookie('BingoValues', mapBingo());
    });

    return newCell;
}

// function to map the bingo
// return an unidimensional array of binary values where 0 means cells its not flipped and 1 means it is
function mapBingo(){
    // get the cell container
    let cell_container=document.getElementById('cell-container');
    let results = [];
    
    // map the cells as 1 if it has flipped or 0 if it hasn't
    Array.from(cell_container.children).forEach(function(cell){
        if(cell.classList.contains('flipped')) results.push(1);
        else results.push(0);
    })
    return results;
}

// function to check if a line or a bingo has happend
function checkBingo(){
    //map the bingo values
    let results = mapBingo();

    //check if the bingo has occured and show the modal if it has
    if(!results.includes(0)) showResultConten('Acabas de cantar bingo');

    //check if a line has occured if not happend before
    if(!line){
        let group1 = results.slice(0,3).includes(0);
        let group2 = results.slice(3,6).includes(0);
        let group3 = results.slice(6,9).includes(0);

        if (!group1 || !group2 || !group3){
            // show the modal
            showResultConten('Acabas de cantar línea');
            // change the global variable of the line happend
            line = true;
        }
    }
}

// Function that shows the result modal with the text passed as parameter
function showResultConten(text){
    // change the text of the modal to the text in the parameter
    document.getElementById('modal-notification').innerText = text;
    // shows the moddal
    $('#notification-modal').modal('toggle');

    // play different sound depending of the value of line
    if(!line) lineSound.play();
    else bingoSound.play();
}

// funciton that load n cells where n is an integer as parameter
async function loadCells(n){
    try {
        // Get the container of the cells
        const container = document.getElementById('cell-container');

        // set the size of the cell based on the number of them
        let size='s';
        if(n==1){
            size = 'b';
        }else if (n==2){
            size = 'm';
        }

        // create all the cells giving them an id, a content and the size
        for (let i = 0; i < n; i++) {
            let cell = createCell(i, data[i], size);
            container.appendChild(cell);
        }
        // set the color of all cells
        setCellColor();

    } catch (error) {
        // throw an error by console if anythong happens
        console.error('Error loading cells:', error);
    }
}

// give the cells the class c1 or c2 which determine the color of the cell
function setCellColor(){
    // get all cells
    let cells=document.getElementsByClassName('cell');
    for(let i = 0; i < cells.length; i++){
        // remove class c1 or c2 of the cell
        cells[i].classList.remove('c1', 'c2');

        // give different colors if the browser is in small size or not 
        if (windowWidth == 'sm'){
            // if is in small size give the color by line
            if(i >= 3 && i < 6) cells[i].classList.add('c1');
            else cells[i].classList.add('c2');
        }else{
            // if is in regular size gives alternative color
            if (i % 2) {
                cells[i].classList.add('c1');
            } else {
                cells[i].classList.add('c2');
            }
        }
    }
}

// fucntion that set a cookie given the name and the value as parameters
function setCookie(name, value) {
    let v = value;
    // if the value is an array, change it to json
    if(Array.isArray(value)){
        v = JSON.stringify(value);
    }
    // set the cookie without timer
    document.cookie = name + "=" + (v || "") + "; path=/";
}

// function that get the cookie passed by parameter
function getCookie(name) {
    let nameEQ = name + "=";
    // split the cookie string
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        // remove the spaces before the cookie
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        // check if the current string is the cookie we are looking for
        if (c.indexOf(nameEQ) == 0) {
            // extract value of the cookie
            let value = c.substring(nameEQ.length, c.length);
            try {
                // try to parse the cookie as an array
                arr = JSON.parse(value);
                // return null if the parsed array is empty
                if(arr.length === 0){
                    return null
                }
                // return the array if parsed succesfully and not empty
                return arr
            } catch (e) {
                // if the parse failed return the cookie as a string
                return value;
            }
        }
    }
    // return null if no matching cookie is found
    return null;
}

// Function to delete a cookie by name
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0; path=/';
}

// create de cookie UI giving an array as parameter
function createCookieUI(arr){
    // get the element where de cookies go
    let currentData = document.getElementById('current-data');
    // create as many Cookie cells as elements in array and append them to its container
    for(let i=0; i<arr.length;i++){
        let cell = createCookieCell(arr[i]);
        currentData.appendChild(cell);
    }
}

// function to create a cell of the cookie interface
// get the content of the cookie as a parameter
function createCookieCell(content){
    // Create the html structure
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

    // add an event to delete the cell
    deleteButton.addEventListener('click', function() {
        card.remove();
        // save the new cookie distribution
        saveCookieData();
    });

    // return the cell
    return card;
}

// function to add a new cookie cell with the text in the parameter
function addCookieCell(txt){
    // if the text is not empty add it to cell list
    if(txt.trim() !== ''){
        let currentData = document.getElementById('current-data');
        let cell = createCookieCell(txt);
        currentData.appendChild(cell);
        // Save all cookies in the list
        saveCookieData();
    }
}

// save the data of the Properies UI in the bingoData Cookie
function saveCookieData(){
    let cardBodies = document.querySelectorAll('#current-data > .card > .card-body > .text-content');
    let content = [];
    // get all the data in the cookie UI and push it to an array
    cardBodies.forEach(textDiv =>{
        content.push(textDiv.textContent.trim());
    });
    // save the array in the cookie
    setCookie('bingoData', content);
}

// function that creates a new cell based on the input content and empties it
function uploadButton(){
    let cookieInput = document.getElementById('cookie-input');
    addCookieCell(cookieInput.value);
    cookieInput.value='';
}

// Launch of the app with the load of the DOM
document.addEventListener('DOMContentLoaded', async () => {
    //set the window with variable
    if(window.innerWidth < 756) windowWidth='sm';
    else windowWidth = 'md';

    // get the data
    if(getCookie('bingoData')==null){
        // if there isn't cookie, fetch it from API and save it in the cookie
        fullData = await fetchData();
        setCookie('bingoData', fullData);
    }else{
        // if there is cookie, get the data from it
        fullData=getCookie('bingoData');
    }
    
    if(getCookie('currentData')==null){
        // Set the number of data num_data
        if(fullData.length<3)
            num_data=fullData.length;
        else if(fullData.length<6)
            num_data=3;
        else if(fullData.length<9)
            num_data=6
        else
            num_data=9

        //set data as a shuffled subarray with num_data elements
        data = shuffleArray(fullData).slice(0, num_data);
        //set the currentData cookie with the data seted previously
        setCookie('currentData', data);
    }else{
        data = getCookie('currentData');
        num_data = data.length;
    }

    // add the upload button functionality
    document.getElementById('upload-button').addEventListener('click', uploadButton);
    
    // add the upload button functionality to the input of cookies when presed enter
    document.getElementById('cookie-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            uploadButton();
        }
    });
    
    // add the save changes button functionality
    document.getElementById('save-cookies').addEventListener('click', function() {
        // save all the cookies, even the one which is written in the input
        uploadButton();
        saveCookieData();
        // hide the modal of properties and reload the page
        $('#property-modal').modal('hide');
        location.reload();
    });

    // add the delete cookies button functionality
    document.getElementById('del-cookies').addEventListener('click', function(){
        // deletes the cookie and empties the Cookie UI
        eraseCookie('bingoData');
        document.getElementById('current-data').innerHTML = '';
    });

    // Create the cookie UI with the data
    createCookieUI(fullData)

    // Loads different number of cells based on the number of data
    loadCells(num_data);
});

// add event to change the cells color ant the value of the windowWith variable when the window is resized
window.addEventListener('resize', function(event) {
    if(this.window.innerWidth <= 768 && windowWidth == 'md'){
        windowWidth = 'sm';
        setCellColor();
    }else if(this.window.innerWidth > 768 && windowWidth == 'sm'){
        windowWidth = 'md';
        setCellColor();
    }
}, true);