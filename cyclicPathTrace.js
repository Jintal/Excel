
async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    const [srcRow, srcCol] = cycleResponse;
    const visited = [];
    const dfsVisisted = [];

    for(let i=0; i<rows; ++i) {

        const visitedRow = [];
        const dfsVisistedRow = [];

        for(let j=0; j<cols; ++j) {
            visitedRow.push(false);
            dfsVisistedRow.push(false);
        }

        visited.push(visitedRow);
        dfsVisisted.push(dfsVisistedRow);
    }

    const response = await dfsCycleDetectionTracePath(graphComponentMatrix, srcRow, srcCol, visited, dfsVisisted);
    
    if(response) return Promise.resolve(true);

    return Promise.resolve(false);
}

function colorPromise() {
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        }, 1000); 
    });
}


// Coloring cells for tracking
async function dfsCycleDetectionTracePath(graphComponentMatrix, srcRow, srcCol, visited, dfsVisisted) {

    visited[srcRow][srcCol] = true;
    dfsVisisted[srcRow][srcCol] = true;

    const cell = document.querySelector(`.cell[rid="${srcRow}"][cid="${srcCol}"]`);
    cell.style.backgroundColor = "lightblue";

    await colorPromise();

    for(let children=0; children<graphComponentMatrix[srcRow][srcCol].length; ++children) {
        const [childRID, childCID] = graphComponentMatrix[srcRow][srcCol][children];

        if(visited[childRID][childCID] === false) {
            const response = await dfsCycleDetectionTracePath(graphComponentMatrix, childRID, childCID, visited, dfsVisisted);
            if(response === true) {
                cell.style.backgroundColor = 'transparent';
                await colorPromise();

                return Promise.resolve(true);
            }
        } else if(dfsVisisted[childRID][childCID] === true) {
            const cyclicCell =  document.querySelector(`.cell[rid="${childRID}"][cid="${childCID}"]`);

            cyclicCell.style.backgroundColor = "lightsalmon";
            await colorPromise();
            
            cell.style.backgroundColor = 'transparent';
            await colorPromise();
            
            return Promise.resolve(true);
        }
    }

    dfsVisisted[srcRow][srcCol] = false;

    return Promise.resolve(false);
}