let ctrlKey;
const rangeStorage = [];
const copyData = [];
const cpyBtn = document.querySelector('.copy');
const cutBtn = document.querySelector('.cut');
const pasteBtn = document.querySelector('.paste');


document.addEventListener('keydown', function(event){
    // Will make the variable true, when ctrl key is pressed
    ctrlKey = event.ctrlKey;
});

document.addEventListener('keyup', function(event){
    // Will make the variable false, when ctrl key is unpressed
    ctrlKey = event.ctrlKey;
});


function changeSelectedCellsToDefaultUI() {
    for(let i=0; i<rangeStorage.length; ++i) {
        const cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}

function handleSelectedCells(cell) {
    cell.addEventListener('click', function(event){
        // Select cells and store them to work on them

        // If ctrl ley is not pressed while slecting cells then return
        if(!ctrlKey) return; 

        //If there are already two cells in the rangeStorage then unselect all the cells and remove them from the array. 
        // So that when a third cell is clicked it will start from that cell
        if(rangeStorage.length >= 2) {
            changeSelectedCellsToDefaultUI();
            rangeStorage.splice(0, rangeStorage.length);
        }

        // Highlight the selected cells
        cell.style.border = "3px solid #218c74";

        const rid = Number(cell.getAttribute('rid'));
        const cid = Number(cell.getAttribute('cid'));

        rangeStorage.push([rid, cid]);
    });
}


for(let i=0;i<rows;++i) {
    for(let j=0; j<cols; ++j) {
        // Add event listeners to all cell so that when clicked while pressing ctrl key they should be highlighted
        const cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

cpyBtn.addEventListener('click', function(event){
    // Copy the selected region and store in copyData for use
    
    // If two cells are not selected then return
    if(rangeStorage.length < 2) return;

    // Reset copyData
    copyData.splice(0, copyData.length);

    const startRow = rangeStorage[0][0];
    const endRow = rangeStorage[1][0];
    const startCol = rangeStorage[0][1];
    const endCol = rangeStorage[1][1];

    for(let i=startRow; i <= endRow; ++i) {
        const dataRow = [];
        for(let j = startCol; j <= endCol; ++j) {
            const cellProp = sheetDB[i][j];
            dataRow.push(cellProp);
        }
        copyData.push(dataRow);
    }

    // Reset the UI
    changeSelectedCellsToDefaultUI();
});

pasteBtn.addEventListener('click', function(event){
    // Paste the data of cells
    
    if(rangeStorage.length < 2) return;

    // The user just has to select the starting cell and this function will automatically fill all the starting from the cell
    const cellAddress = document.querySelector('.address-bar').value;

    const [startRow, startCol] = decodeRIDCIDFromAddress(cellAddress);

    const rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    const colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // r -> CopyData row, c -> CopyData col
    for(let i=startRow, r = 0; i<=startRow+rowDiff; ++i, r++) {
        for(let j=startCol, c = 0; j<=startCol+colDiff; ++j, c++) {
            const cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            if(!cell) continue;
            
            // DB
            const data = copyData[r][c];
            const cellProp = sheetDB[i][j];
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            // UI
            //Click the cell to update the cell
            cell.click();
        }
    }
});

cutBtn.addEventListener('click', function(event){
    if(rangeStorage.length < 2) return;

    // Reset copyData
    copyData.splice(0, copyData.length);

    const startRow = rangeStorage[0][0];
    const endRow = rangeStorage[1][0];
    const startCol = rangeStorage[0][1];
    const endCol = rangeStorage[1][1];

    for(let i=startRow; i <= endRow; ++i) {
        for(let j = startCol; j <= endCol; ++j) {
            const cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell) continue;

            // DB
            const cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = '14';
            cellProp.fontFamily = 'monospace';
            cellProp.fontColor = '#000000';
            cellProp.BGcolor = '#ecf0f1'
            cellProp.alignment = 'left';

            // UI
            cell.click();

        }
    }

    // Reset UI
    changeSelectedCellsToDefaultUI();
});