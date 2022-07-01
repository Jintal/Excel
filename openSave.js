const downloadBtn = document.querySelector('.download');
const openBtn = document.querySelector('.upload');

// Donwload Task
downloadBtn.addEventListener('click', function(event) {
    const jsonData = JSON.stringify([sheetDB, graphComponentMatrix]);
    const file = new Blob([jsonData], {type: "application/json"});

    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = "SheetData.json";

    a.click();
});

// Open Task(Upload)
openBtn.addEventListener('click', function(event){

    // Open file explorer
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.addEventListener('change', function(event){
        const fr = new FileReader();
        const files = input.files;
        const fileObj = files[0];

        fr.readAsText(fileObj);
        fr.addEventListener('load', function(event){
            const sheetData = JSON.parse(fr.result);

            // A new sheet will be created aling with SheetDB and graphComponent
            addSheetBtn.click();

            sheetDB = sheetData[0];
            graphComponentMatrix = sheetData[1];
            
            // collecterSheetDB and collecterGraph has empty sheetDB and graphComp so replace them
            collectedSheetDB[collectedSheetDB.length-1] = sheetDB;
            collectedGraphComponent[collectedGraphComponent.length - 1] = graphComponentMatrix;

            // Update the sheet
            handleSheetProperties();
        }); 
    });
})