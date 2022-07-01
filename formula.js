// focus -> When we click on an input the cursor bliks on it, it is in focus mode.
// blur -> When we have clicked on a cell, and then we click on another cell, the cursor moves to the other cell, then the first cell is said to be in blur mode for that moment.


// Attach event listener to each cell
for(let i=0;i<rows; ++i) {
    for(let j=0;j<cols; ++j) {
        const cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", function(event){
            // active_cell === cell, since when blur event occurs, the address in the addressBar would be of this cell only.
            const [activeCell, activeCellProp] = getCell(addressBar.value);
            const enteredData = activeCell.innerText.trim();

            if(enteredData == activeCellProp.value) return;

            activeCellProp.value = enteredData;

            // If we are inputing hardcoded values, then we have to break it's P-C relationship, formula and also update the value of it's children
            removeChildFromParent(activeCellProp.formula);
            activeCellProp.formula = "";
            updateChildrenCells(addressBar.value);
        })
    }
}

// Formula Bar can have some formula written in it, we need to evaluate it and eneter the value in the active cell
const formulaBar = document.querySelector('.formula-bar');

formulaBar.addEventListener('keydown', async function(event){
    const inputFormula = formulaBar.value.trim();

    if(event.key === 'Enter' && inputFormula) {
        const [cell, cellProp] = getCell(addressBar.value);
        
        // If formula is changed break previous relation and add new relationship
        if(inputFormula !== cellProp.formula) {
            removeChildFromParent(cellProp.formula);
        }
        
        const evaluatedValue = evaluateFormula(inputFormula);

        addChildToGraphComponent(inputFormula, addressBar.value);

        // Check formula is cyclic or not then only evaluate
        const cycleResponse = isGraphCyclic(graphComponentMatrix);

        if(cycleResponse){
            let response = confirm("Your formula is cyclic, do you want to trace your path?");

            while(response) {
                // Keep on tracking color, until user is satisfied.
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);

                response = confirm("Your formula is cyclic, do you want to trace your path?");
            }

            // Remove the relation causing cycle
            removeChildFromGraphComponent(inputFormula, addressBar.value);

            return;
        }

        setCellUIAndCellProp(evaluatedValue, inputFormula, addressBar.value);
        addChildToParent(inputFormula);
        // If we change the value of current cell, then all the cells that are dependent on it those values should be changed too.
        updateChildrenCells(addressBar.value);
    }
});

function addChildToGraphComponent(formula, childAddress) {
    const [rid, cid] = decodeRIDCIDFromAddress(childAddress);
    const encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; ++i) {
        const asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            const [parentRID, parentCID] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[parentRID][parentCID].push([rid, cid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    const [rid, cid] = decodeRIDCIDFromAddress(childAddress);
    const encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; ++i) {
        const asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue >= 65 && asciiValue <= 90) {
            const [parentRID, parentCID] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[parentRID][parentCID].pop();
        }
    }
}

function addChildToParent(formula) {
    // The cell on which we are putting expression, this cell will be children of all the cells we will use in our expression.
    const childAddress = addressBar.value;
    const encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; ++i) {
        // Check if the current value is an character or not i.e. b/w [A-Z]
        const asciiValue = encodedFormula[i].charCodeAt(0);

        if(asciiValue >= 65 && asciiValue <= 90) {
            // Get the cell that act as a parent cell and add this child cell on which we are working as childre.
            const [parentCell, parentCellProp] = getCell(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromParent(formula) {
    const childAddress = addressBar.value;
    const encodedFormula = formula.split(" ");

    for(let i=0; i<encodedFormula.length; ++i) {
        // Check if the current value is an character or not i.e. b/w [A-Z]
        const asciiValue = encodedFormula[i].charCodeAt(0);

        if(asciiValue >= 65 && asciiValue <= 90) {
            // Get the cell that act as a parent cell and add this child cell on which we are working as childre.
            const [parentCell, parentCellProp] = getCell(encodedFormula[i]);
            const idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

/*
* V.V.IMP :-
* This function can result in stack overflow, if there is a cycle
! Let's say B1 is a child of A2 i.e. "A2:children -> B1"
! Now let's say we update A2 with B1 * 2, so now A2 is a child of B1 too i.e. "B1:children -> A2"
! After we update value of A2, we try to update the value of it's children i.e. B1 , after B1 we again update value of it's children i.e. A2 and so on so on.
* We can see that we clerly be stuck in a infinite loop
*/

function updateChildrenCells(parentAddress) {
    const [parentCell, parentCellProp] = getCell(parentAddress);
    const children = parentCellProp.children;

    for(let i=0; i<children.length; ++i) {
        const childAddress = children[i];
        const [childCell, childCellProp] = getCell(childAddress);
        const childFormula = childCellProp.formula;

        const evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        // Recursively changing all childrens of this children too.
        updateChildrenCells(childAddress);
    }
}

function evaluateFormula(formula) {
    
    // Formula should be space separated
    const encodedFormula = formula.split(" ");
    
    for(let i=0; i<encodedFormula.length; ++i) {
        // Check if the current value is an character or not i.e. b/w [A-Z]
        const asciiValue = encodedFormula[i].charCodeAt(0);

        if(asciiValue >= 65 && asciiValue <= 90) {
            const [cell, cellProp] = getCell(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }

    const decodedFormula = encodedFormula.join(" ");

    // In-built JS function to evaluate a expression
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address) {
    const [cell, cellProp] = getCell(address);

    cellProp.value = evaluatedValue; // Data Changes
    cellProp.formula = formula; // Data Changes
    cell.innerText = cellProp.value; // UI Changes
}
