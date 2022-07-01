// It is used to dynamically create all the cells and add them inside the grid container

const rows = 100;
const cols = 26;

const addressColCont = document.querySelector('.address-col-cont');
const addressRowCont = document.querySelector('.address-row-cont');
const cellsCont = document.querySelector('.cells-cont');
const addressBar = document.querySelector('.address-bar');

// Left number col
for(let i=0; i<rows; ++i) {
    const addressCol = document.createElement('div');
    addressCol.setAttribute('class', 'address-col');
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

// Top alphabet row
for(let i=0; i<cols; ++i) {
    const addressRow = document.createElement('div');
    addressRow.setAttribute('class', 'address-row');
    addressRow.innerText = String.fromCharCode(i+65);
    addressRowCont.appendChild(addressRow);
}

function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener('click', function(event) {
        const rowID = i+1;
        const colID = String.fromCharCode(j+65);
        addressBar.value = `${colID}${rowID}`;
    })
}

// Cells
for(let i=0; i<rows; ++i) {
    
    const rowCont = document.createElement('div');
    rowCont.setAttribute('class', 'row-cont');

    for(let j=0; j<cols; ++j) {
        const cell = document.createElement('div');
        cell.setAttribute('class', 'cell');
        cell.setAttribute('contenteditable', 'true');
        cell.setAttribute('spellcheck', 'false');
        // To identify individual cell
        cell.setAttribute('rid', i);
        cell.setAttribute('cid', j);
        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }

    cellsCont.appendChild(rowCont);
}

