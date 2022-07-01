// Storage of P-C relations
const collectedGraphComponent = [];

// It will be assigned by sheetsHandling function
let graphComponentMatrix = [];

// for(let i=0; i<rows; ++i) {
//     const row = [];

//     for(let j=0; j<cols; ++j) {
        
        // * More than 1 child relation, so to represent dependency
//         row.push([]);
//     }

//     graphComponentMatrix.push(row);
// }

function isGraphCyclic(graphComponentMatrix) {
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

    for(let i=0; i<rows; ++i) {
        for(let j=0; j<cols; ++j) {
            if(visited[i][j] === false) {
                const response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisisted);
                if(response === true) return [i,j];
            }
        }
    }

    return null;
}

function dfsCycleDetection(graphComponentMatrix, srcRow, srcCol, visited, dfsVisisted) {

    visited[srcRow][srcCol] = true;
    dfsVisisted[srcRow][srcCol] = true;

    for(let children=0; children<graphComponentMatrix[srcRow][srcCol].length; ++children) {
        const [childRID, childCID] = graphComponentMatrix[srcRow][srcCol][children];

        if(visited[childRID][childCID] === false) {
            const response = dfsCycleDetection(graphComponentMatrix, childRID, childCID, visited, dfsVisisted);
            if(response === true) return true;
        } else if(dfsVisisted[childRID][childCID] === true) {
            return true;
        }
    }

    dfsVisisted[srcRow][srcCol] = false;

    return false;
}