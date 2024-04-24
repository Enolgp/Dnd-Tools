//List of spells
var list =['Cantrip']
for(let i=1; i<10; i++){ 
    list.push(`Lvl ${i} spell`);
}

//funcionality of the 'add spell' button
document.getElementById('spell-btn').addEventListener('click', function(){
    document.getElementById('spells').appendChild(createSpell())
})
//funcionality of the 'clear' button
document.getElementById('clear-btn').addEventListener('click', function(){
    document.getElementById('spells').innerHTML=''
})
//funcionality of the spawn and vanish of an input if the permanency is charges
document.getElementById('permanency').addEventListener('change', function(){
    let numericInput = document.getElementById('charges-input');

    if(this.value == 'Charges'){
        //If the value of the select is 'charges' it spawns a numeric input
        if(!numericInput){
            numericInput = document.createElement('input');
            numericInput.setAttribute('type', 'number');
            numericInput.setAttribute('id', 'charges-input');
            numericInput.setAttribute('class', 'form-control mt-2');
            document.getElementById('permanency').after(numericInput);

            //if the value of that input is less than 2, the value of the select changes to 'diary'
            //if the value of that input is more than 6, the value of the select changes to 'permanent'
            numericInput.addEventListener('input', function() {
                const inputValue = parseInt(this.value);
                if (inputValue < 2) {
                    document.getElementById('permanency').value = 'Diary';
                    this.remove();
                } else if (inputValue > 6) {
                    document.getElementById('permanency').value = 'Permanent';
                    this.remove();
                }
            })
        }
    }else{
        //If the value of the select is different from 'charges' it removes the numeric input if it's created
        if(numericInput){
            numericInput.remove();
        }
    }
})
//funcionallity of the 'calculate' button
document.getElementById('calculate').addEventListener('click', function(){
    let res = document.getElementById('result-box')
    //clear the result box when pressed
    res.innerHTML=''
    
    //calculate the price and the bonos and show the numbers in the console
    rarityVal=rarityBono();
    console.log(`Rarity value : ${rarityVal}`)
    spellValue=spellLvl();
    console.log(`Spell value : ${spellValue}`)
    permanencyValue=permanencyCost()
    console.log(`Permanency value : ${permanencyValue}`)

    basePrice=30*rarityVal*spellValue*permanencyValue;

    attunementValue=attunementBonus(basePrice)
    charismaValue=chaBonus(basePrice)
    
    output(basePrice, attunementValue, charismaValue)
})
//create a select of the spells using the list.
//Returns the html div
function createSpell(){
    let spellDiv = document.createElement('div');
    spellDiv.classList.add('spell', 'form-group');
    let selectElement = document.createElement('select');
    selectElement.classList.add('form-control','spell-data');
    
    let option = document.createElement('option');
    option.setAttribute('disabled', true);
    option.setAttribute('selected', true);
    option.setAttribute('hidden', true);
    // option.textContent='Select Spell Level';
    selectElement.appendChild(option);

    list.forEach(function(val){
        let option = document.createElement('option');
        option.textContent=val;
        selectElement.appendChild(option);
    })
    spellDiv.appendChild(selectElement)
    document.getElementById('spells').appendChild(spellDiv)
    return(spellDiv)
}
//return the rarity modifier based on the election of the rarity select
function rarityBono(election){
    election=document.getElementById('rarity').value;
    switch(election){
        case 'Common':
            return 1;
        case 'Uncommon':
            return 1.5;
        case 'Rare':
            return 2;
        case 'Very Rare':
            return 3;
        case 'Legendary':
            return 5;
    }
}
//return the sumatory of all the spells value
function spellLvl(){
    spellList = document.querySelectorAll('#spells .spell-data');
    total=0;

    spellList.forEach(function(element){
        console.log('element: ' + element.value+ ' | value: ' + getSpellValue(element.value))
        total+=getSpellValue(element.value);
    })

    return total;
}
//return the value associted to a spell wich is the summatory of all spell levels from cantrip (1) to the spell level (level+1)
function getSpellValue(spell){
    switch(spell){
        case 'Cantrip':
            return sumatory(1);
        case 'Lvl 1 spell':
            return sumatory(2);
        case 'Lvl 2 spell':
            return sumatory(3);
        case 'Lvl 3 spell':
            return sumatory(4);
        case 'Lvl 4 spell':
            return sumatory(5);
        case 'Lvl 5 spell':
            return sumatory(6);
        case 'Lvl 6 spell':
            return sumatory(7);
        case 'Lvl 7 spell':
            return sumatory(8);
        case 'Lvl 8 spell':
            return sumatory(9);
        case 'Lvl 9 spell':
            return sumatory(10);
    }
}
//gets a number n
//return the sumatory from 1 to a number n
function sumatory(n){
    var s = 0;
    for(let i=n; i>0; i--){
        s+=i;
    }
    return s;
}
//return the permanency cost based on the value of the permanency select
function permanencyCost(){
    let election=document.getElementById('permanency').value;
    switch(election){
        case 'Consumible':
            return 1;
        case 'Diary':
            return 4;
        case 'Charges':
            numCharges= document.getElementById('charges-input').value;
            return 3+parseInt(numCharges);
        case 'Permanent':
            return 10;
    }
}
//gets the base price of the item
//return de positive or negativ bonus based on the state of the attunement checkbox that has to be added to the final price
function attunementBonus(val){
    let state = document.getElementById('attunement').checked;

    if(!state){
        return val*0.1;
    }else{
        return 0;
    }
}
//gets the base price of the item
//return de positive or negativ bonus based on the charisma modifier bonus that has to be added to the final price
function chaBonus(val){
    let cha = document.getElementById('charisma').value;

    if(cha!=0){
        aux=-cha/10
        return val*aux
    }else{
        return 0
    }
}
//show the base price, different bonuses and total price on the re div
function output(base, att, cha){
    let res = document.getElementById('result-box')
    let total=base+att+cha;

    let div = document.createElement('div');
    div.classList.add('h1');
    div.textContent='Result'
    res.appendChild(div)
    
    let cardContainer = document.createElement('div');
    cardContainer.classList.add('mt-3', 'd-flex', 'row', 'justify-content-between', 'align-items-start');
    
    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'col-sm-4', 'mb-3', 'h3', 'bg-info');
    cardDiv.textContent = `Total Price : ${total}`
    cardContainer.appendChild(cardDiv)

    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'col-sm-4', 'mb-3', 'h3', 'bg-light');
    cardDiv.textContent = `Base Price : ${base}`
    cardContainer.appendChild(cardDiv)

    var cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'col-sm-4', 'mb-3', 'h3', 'bg-light');
    cardDiv.textContent = `Attunement bono : ${att}\nCharisma bono: ${cha}`
    cardContainer.appendChild(cardDiv)

    res.appendChild(cardContainer)
}