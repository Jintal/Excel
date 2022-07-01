const addSheetBtn = document.querySelector('.sheet-add-icon');
const sheetsFolderCont = document.querySelector('.sheets-folder-cont');

addSheetBtn.addEventListener('click', function(event){
    const sheet = document.createElement('div');
    sheet.setAttribute('class', 'sheet-folder');

    const allSheetFolder = [...document.querySelectorAll('.sheet-folder')];

    sheet.setAttribute('id', `${allSheetFolder.length}`)

    sheet.innerHTML = `
        <div class="sheet-content">Sheet ${allSheetFolder.length+1}</div>
    `;
    sheetsFolderCont.appendChild(sheet);

    // Make sheet come into view
    sheet.scrollIntoView();


    // DB for data of every sheet
    createSheetDB();
    createGraphComponentMatrix();
    handleSheetActiveness(sheet);
    handleSheetRemoval(sheet);
    sheet.click();
});

function handleSheetDB(sheetIdx) {
    sheetDB = collectedSheetDB[sheetIdx];
    graphComponentMatrix = collectedGraphComponent[sheetIdx];
}

// This will make all the cells data according to the DB of the sheet, because it clicks on them and they have a eventListener attached on them, that updates the UI from the DB
function handleSheetProperties() {
    for(let i=0; i<rows; ++i) {
        for(let j=0; j<cols; ++j) {
            // Will click on each cell so that the event listener attached on them updates the UI
            const cell= document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }

    // By default the focus should be on A1 cell
    // It is the first cell
    const firstCell = document.querySelector('.cell');
    firstCell.click();
}

function handleSheetUI(sheet) {
    const allSheetsFolder = [...document.querySelectorAll('.sheet-folder')];

    allSheetsFolder.forEach(function(sheetFolder){
        sheetFolder.style.backgroundColor = 'transparent';
    });

    sheet.style.backgroundColor = "#ced6e0";
}

function handleSheetUIRemoval(sheet) {
    
    // Remove sheet from UI
    sheet.remove();

    // Change the naming of each sheet
    const allSheetsFolder = [...document.querySelectorAll('.sheet-folder')];

    for(let i=0; i<allSheetsFolder.length; ++i) {
        // Change id of each sheet
        allSheetsFolder[i].setAttribute('id', i);
        // Change sheet name or content
        const sheetContent = allSheetsFolder[i].querySelectorAll('.sheet-content');
        sheetContent.innerText = `Sheet ${i+1}`;
        // Remove colour from all sheets
        allSheetsFolder[i].style.backgroundColor = 'transparent';
    }

    // Make first sheet  background active
    allSheetsFolder[0].style.backgroundColor = '#ced6e0';
}

function handleSheetRemoval(sheet) {
    sheet.addEventListener('mousedown', function(event){
        if(event.button !== 2) return;

        const allSheetFolder = document.querySelectorAll('.sheet-folder');
        if(allSheetFolder.length === 1) {
            alert('You need to have atleast 1 sheet!');
            return;
        }

        const response = confirm('Your sheet will be removed permanently, are you sure?');

        if(!response) return;

        // Remove from DB
        const sheetIdx = Number(sheet.getAttribute('id'));
        collectedSheetDB.splice(sheetIdx, 1);
        collectedGraphComponent.splice(sheetIdx, 1);

        // Remove from UI
        handleSheetUIRemoval(sheet)

        // By default assign DB to sheet 1 and then make it active on UI
        sheetDB = collectedSheetDB[0];
        graphComponentMatrix = collectedGraphComponent[0];

        // This will make all the cells data according to the DB of the sheet, because it clicks on them and they have a eventListener attached on them, that updates the UI from the DB
        handleSheetProperties();
    });
}

function handleSheetActiveness(sheet) {
    sheet.addEventListener('click', function(event){
        const sheetIdx =    (sheet.getAttribute('id'));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    });
}

function createSheetDB(){
    const sheetDB = [];

    for(let i=0; i<rows; ++i) {
        const sheetRow = [];

        for(let j=0; j<cols; ++j){
            const cellProp = {
                bold:false,
                italic:false,
                underline:false,
                alignment:'left',
                fontFamily:'monospace',
                fontSize:'14',
                fontColor:'#000000',
                BGcolor: '#ecf0f1',
                value: "",
                formula:"",
                children:[],
            };
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }

    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix() {
    const graphComponentMatrix = [];

    for(let i=0; i<rows; ++i) {
        const row = [];

        for(let j=0; j<cols; ++j) {
            row.push([]);
        }

        graphComponentMatrix.push(row);
    }

    collectedGraphComponent.push(graphComponentMatrix);
}