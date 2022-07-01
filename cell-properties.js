// Storage of all the properties that will be applied on individual cells

// Contains all the database of the sheets
const collectedSheetDB = [];


//*IMP* Even though rows, cols is not defined in this file, but it will be written below grid.js, so all the variables, functions, etc. of that files can be accessed by this file.

// It will be assigned by sheetsHandling function
let sheetDB = [];


{
    // It add's sheet 1 also creates DB for the sheetData and graphData for sheet 1
    addSheetBtn.click();
}

// for(let i=0; i<rows; ++i) {
//     const sheetRow = [];

//     for(let j=0; j<cols; ++j){
//         const cellProp = {
//             bold:false,
//             italic:false,
//             underline:false,
//             alignment:'left',
//             fontFamily:'monospace',
//             fontSize:'14',
//             fontColor:'#000000',
//             BGcolor: '#ecf0f1',
//             value: "",
//             formula:"",
//             children:[],
//         };
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }



// Selectors for cell properties
const bold = document.querySelector('.bold');
const italic = document.querySelector('.italic');
const underline = document.querySelector('.underline');
const fontSize = document.querySelector('.font-size-prop');
const fontFamily = document.querySelector('.font-family-prop');
const fontColor = document.querySelector('.font-color-prop');
const BGColor = document.querySelector('.BGcolor-prop');
const alignment = document.querySelectorAll('.alignment');
const leftAlign = alignment[0];
const centerAlign = alignment[1];
const rightAlign = alignment[2];

const activeColorProp = "#aaadad";
const inactiveColorProp = "#ecf0f1";


// Attach event listeners to property
bold.addEventListener('click', function(event){

    // addressBar has already been defined in grid.js
    // We can find the active cell, from the address of the cell at the top left
    const [cell, cellProp] = getCell(addressBar.value);

    // Modification
    cellProp.bold = !cellProp.bold; // Data change in storage
    cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal'; // UI Change

    // Change the bold icon
    bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
});

italic.addEventListener('click', function(event){

    const [cell, cellProp] = getCell(addressBar.value);

    cellProp.italic = !cellProp.italic; 
    cell.style.fontStyle = cellProp.italic ? 'italic' : 'normal'; 

    italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
});

underline.addEventListener('click', function(event){

    const [cell, cellProp] = getCell(addressBar.value);

    cellProp.underline = !cellProp.underline; 
    cell.style.textDecoration = cellProp.underline ? 'underline' : 'none'; 

    underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
});

fontSize.addEventListener('change', function(event){

    const [cell, cellProp] = getCell(addressBar.value);

    cellProp.fontSize = fontSize.value; // Data Change
    cell.style.fontSize = cellProp.fontSize + 'px'; // UI Change
    fontSize.value = cellProp.fontSize;
});

fontFamily.addEventListener('change', function(event) {
    const [cell, cellProp] = getCell(addressBar.value);

    cellProp.fontFamily = fontFamily.value; // Data Change
    cell.style.fontFamily = cellProp.fontFamily; // UI Change
    fontFamily.value = cellProp.fontFamily;
})

fontColor.addEventListener('change', function(event) {
    const [cell, cellProp] = getCell(addressBar.value);

    cellProp.fontColor = fontColor.value; // Data Change
    cell.style.color = cellProp.fontColor; // UI Change
    fontColor.value = cellProp.fontColor;
});

BGColor.addEventListener('change', function(event) {
    const [cell, cellProp] = getCell(addressBar.value);

    cellProp.BGcolor = BGColor.value; // Data Change
    cell.style.backgroundColor = cellProp.BGcolor; // UI Change
    BGColor.value = cellProp.BGcolor;
});

alignment.forEach(function(align){
    align.addEventListener('click', function(event){
        const [cell, cellProp] = getCell(addressBar.value);

        const alignValue = event.target.classList[0]; // To get left, center, right

        cellProp.alignment = alignValue; // Data Change
        cell.style.textAlign = cellProp.alignment; // UI Change

        switch(alignValue) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
    })
});

// No cell should have any default property, only the properties that are set on them by user should be there
function addListenerToAttachCellProperties(cell) {
    cell.addEventListener('click', function(event){

        const [rid, cid] = decodeRIDCIDFromAddress(addressBar.value);
        const cellProp = sheetDB[rid][cid];
        
        // Apply Cell Properties
        cell.style.fontWeight = cellProp.bold ? 'bold' : 'normal';
        cell.style.fontStyle = cellProp.italic ? 'italic' : 'normal';
        cell.style.textDecoration = cellProp.underline ? 'underline' : 'none';
        cell.style.fontSize = cellProp.fontSize + 'px';
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor;

        // Apply UI Changes based on cell properties
        bold.style.backgroundColor = cellProp.bold ? activeColorProp : inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp : inactiveColorProp;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp : inactiveColorProp;
        fontSize.value = cellProp.fontSize;
        fontFamily.value = cellProp.fontFamily;
        fontColor.value = cellProp.fontColor;
        BGColor.value = cellProp.BGcolor;
        switch(cellProp.alignment) {
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }

        const formulaBar = document.querySelector('.formula-bar');
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;

    });
}

const allCells = [...document.querySelectorAll('.cell')];
allCells.forEach(function(cell){
    addListenerToAttachCellProperties(cell);
});


// Give the address of the active cell and cell Storage
function getCell(address) {
    const [rid, cid] = decodeRIDCIDFromAddress(address);

    // Access cell & storage objct

    // To change the cell in UI
    const cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    // To change the cell in storage
    const cellProp = sheetDB[rid][cid];

    return [cell, cellProp];
}

function decodeRIDCIDFromAddress(address) {
    // address -> A1, return (0,0)

    const rid = Number(address.slice(1)) - 1; // '1' -> '0'
    const cid = Number(address.charCodeAt(0)) - 65; // 'A' -> 65-65 -> 0 

    return [rid, cid];
}