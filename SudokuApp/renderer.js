document.getElementById('checkValidity').addEventListener('click', () => {
    verifySudoku();
});



document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const content = document.getElementById('sudoku-grid');

    const scale = 1.1;
    const scaleAmount = 0.1;

    const rect = content.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const deltaX = x * scaleAmount * (event.deltaY < 0 ? 1 : -1);
    const deltaY = y * scaleAmount * (event.deltaY < 0 ? 1 : -1);

    // content.style.transformOrigin = `${x}px ${y}px`;
    content.style.transform = `scale(${scale}) translate(${deltaX}px, ${deltaY}px)`;
})





let solution;
/*  
 * Create the sudoku grid
 * @return {void}
 */

document.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
        // event.preventDefault();  

        const scaleAmount = 0.1;
        const content = document.getElementById('sudoku-grid');
        let scale = parseFloat(content.style.transform.replace(/[^0-9.]/g, '')) || 1;

        if (event.deltaY < 0) {
            scale += scaleAmount;
        } else {
            scale -= scaleAmount;
        }
        scale = Math.max(0.1, Math.min(scale, 10));

        const rect = content.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const deltaX = x * scaleAmount * (event.deltaY < 0 ? 1 : -1);
        const deltaY = y * scaleAmount * (event.deltaY < 0 ? 1 : -1);

        // content.style.transformOrigin = `${x}px ${y}px`;
        content.style.transform = `scale(${scale}) translate(${deltaX}px, ${deltaY}px)`;
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        document.body.style.cursor = 'grab';
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        document.body.style.cursor = '';
    }
});

let panning = false;
let panStartX = 0;
let panStartY = 0;

document.addEventListener('mousedown', (event) => {
    if (document.body.style.cursor === 'grab') {
        panning = true;
        panStartX = event.clientX;
        panStartY = event.clientY;
        document.body.style.cursor = 'grabbing';
        event.target.style.cursor = 'grabbing';
    }
});

document.addEventListener('mousemove', (event) => {
    if (panning) {
        const dx = event.clientX - panStartX;
        const dy = event.clientY - panStartY;
        window.scrollBy(-dx, -dy);
        panStartX = event.clientX;
        panStartY = event.clientY;
    }
});

document.addEventListener('mouseup', (event) => {
    if (panning) {
        document.body.style.cursor = 'grab';
        panning = false;
    }
});


function createSudokuGrid(nb_cells = 81) {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.classList.add('grid-template');
    const row_size = Math.sqrt(nb_cells);
    const subgrid_size = Math.sqrt(row_size);

    for (let i = 0; i < nb_cells; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';

        // Determine the subgrid index
        const subgrid_row = Math.floor(Math.floor(i / row_size) / subgrid_size);
        const subgrid_col = Math.floor((i % row_size) / subgrid_size);
        const subgrid_index = subgrid_row * subgrid_size + subgrid_col;

        cell.classList.add(`subgrid-${subgrid_index}`);

        cell.addEventListener('mouseover', () => {
            document.querySelectorAll(`.subgrid-${subgrid_index}`).forEach(subgridCell => {
                subgridCell.classList.add('hovered-subgrid');
            });
        });

        cell.addEventListener('mouseout', () => {
            document.querySelectorAll(`.subgrid-${subgrid_index}`).forEach(subgridCell => {
                subgridCell.classList.remove('hovered-subgrid');
            });
        });

        cell.addEventListener('click', () => {
            const zoomedCellIndex = subgrid_index;
            const row = Math.floor(zoomedCellIndex / subgrid_size) * subgrid_size;
            const col = (zoomedCellIndex % subgrid_size) * subgrid_size;

            const cellWidth = 20;
            const cellHeight = 20;
            const scale = 2;

            const translateX = -col * cellWidth + (window.innerWidth / 2 - cellWidth * subgrid_size / 2);
            const translateY = -row * cellHeight + (window.innerHeight / 2 - cellHeight * subgrid_size / 2);

            gridElement.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
        });

        // Add bold borders for subgrid boundaries
        if (Math.floor(i / row_size) % subgrid_size === subgrid_size - 1) {
            cell.classList.add('bold-bottom-border');
        }
        if (i % row_size % subgrid_size === subgrid_size - 1) {
            cell.classList.add('bold-right-border');
        }

        gridElement.appendChild(cell);
    }

    document.getElementById('style-head').innerHTML = `
        .grid-container {
            /*overflow: auto; /* Enable scrolling */
            position: relative;
        }
        .grid-template {
            display: grid;
            gap: 1px;
            grid-template-columns: repeat(${row_size}, 20px);
            transition: transform 0.3s ease-in-out;
            transform-origin: 0 0; /* Set the transform origin to the top-left corner */
        }
        .sudoku-cell {
            border: 1px solid #ccc;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .sudoku-cell :hover {
            cursor: zoom-in;
        }
        .bold-bottom-border {
            border-bottom: 2px solid black;
        }
        .bold-right-border {
            border-right: 2px solid black;
        }
        .hovered-subgrid {
            background-color: lightblue;
        }
    `;
}

// Add a button to reset the zoom
const resetButton = document.createElement('button');
resetButton.innerText = 'Reset Zoom';
resetButton.classList.add('button');
resetButton.addEventListener('click', () => {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.style.transform = 'scale(0.8) translate(0, 0)';
});
document.getElementById('button-container').appendChild(resetButton);

// Create a container for the grid and append it to the body
const gridContainer = document.createElement('div');
gridContainer.className = 'grid-container';
gridContainer.appendChild(document.getElementById('sudoku-grid'));
document.getElementById('container').appendChild(gridContainer);




window.electronAPI.loadFileAsync();


window.electronAPI.listenFirstLine();
window.electronAPI.onFirstLineLoaded((line) => {
    const nb_of_cells = Math.floor(Math.pow(parseInt(line) - 1, 2));
    createSudokuGrid(nb_of_cells);
});

window.electronAPI.listenFileLoaded();
window.electronAPI.onFileLoaded((sudoku) => {
    console.log('----> File loaded <---');

    const cells = document.getElementsByClassName('sudoku-cell');
    sudoku.split(' ').forEach((value, index) => {
        if (value.includes('\n')) {
            value = value.replace('\n', '');
        }
        if (value.includes("undefined")) {
            value = value.replace("undefined", "");
        }
        if (value === 'X') {
            cells[index].addEventListener('click', function(event) {
                document.getElementById('numberPopup').style.display = 'block';
                generateNumbers(event.target, index, nb_of_cells);
            });
        }
        cells[index].appendChild(document.createElement('a'));
        cells[index].children[0].innerHTML = (value === 'X') ? ' ' : value;
        cells[index].children[0].readOnly = true;

    });
});


/*
 * Verify if the sudoku is complete
 * @return {void}
 */


function verifySudoku() {
    const cells = document.getElementsByClassName('sudoku-cell');
    let isComplete = true;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].children[0].value === ' ') {
            isComplete = false;
            break;
        }
    }
    if (isComplete) {
        let row_size = Math.floor(Math.sqrt(cells.length));
        let inner_row_size = Math.sqrt(row_size);


        let flat_board = [].slice.call(cells).map(cell => cell.children[0].value);
        let board = []; // 2D array
        for (let i = 0; i < flat_board.length; i += row_size) {
            let chunk = flat_board.slice(i, i + row_size);
            board.push(chunk);
        }




        for (let i = 0; i < row_size; i++) {
            let rowSet = new Set();
            let colSet = new Set();
            let boxSet = new Set();

            for (let j = 0; j < row_size; j++) {
                let rowVal = board[i][j];
                let colVal = board[j][i];
                let boxVal = board[inner_row_size * Math.floor(i / inner_row_size) + Math.floor(j / inner_row_size)][inner_row_size * (i % inner_row_size) + (j % inner_row_size)];

                // Check if the current row value is valid
                if (rowVal !== ' ') {
                    if (rowSet.has(rowVal)) {
                        console.log(rowSet,
                            rowVal,
                            rowSet.has(rowVal),
                            i)

                        console.error(`Invalid placement: ${rowVal} already in row ${i}`);
                        return false;
                    }
                    rowSet.add(rowVal);
                }

                // Check if the current column value is valid
                if (colVal !== ' ') {
                    if (colSet.has(colVal)) {
                        console.log(colSet,
                            colVal,
                            `at pos ${i},${j}`, )
                        console.error(`Invalid placement: ${colVal} already in column ${i+1}`);
                        return false;
                    }
                    console.log("inserting -- ", colVal, "at pos", i, j, "in colSet")
                    colSet.add(colVal);
                }

                // Check if the current box value is valid
                if (boxVal !== ' ') {
                    if (boxSet.has(boxVal)) {
                        console.error(`Invalid placement: ${boxVal} already in ${inner_row_size}x${inner_row_size} subgrid ${Math.floor(i / inner_row_size)}, ${Math.floor(j / inner_row_size)}`);
                        return false;
                    }
                    boxSet.add(boxVal);
                }
            }
        }
        alert('Sudoku is complete');
    } else {
        alert('Sudoku is not complete');
    }
}


/*
 * Generate numbers to be displayed in the popup
 * @param {HTMLElement} element - The element that was clicked
 * @param {number} index - The index of the element that was clicked
 * @return {void}
 */

function generateNumbers(element, index, nb_cells = 81) {
    const container = document.querySelector('.number-grid');
    const row_size = Math.floor(Math.sqrt(nb_cells));
    const inner_row_size = Math.floor(Math.sqrt(row_size));
    let row = Math.floor(index / row_size);
    let column = index % row_size;
    container.innerHTML = ''; // Clear previous numbers if any
    element.innerHTML = '';
    for (let i = 1; i <= row_size; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        numberDiv.addEventListener('click', function() {
            const cells = document.getElementsByClassName('sudoku-cell');
            // if there is the same number in the row, column or 3x3 grid, don't allow the user to place the number
            for (let j = 0; j < row_size; j++) {
                if (cells[row * row_size + j].children[0].value === i.toString()) {
                    alert('Invalid placement: ' + i + ' already in row');
                } else if (cells[j * row_size + column].children[0].value === i.toString()) {
                    alert('Invalid placement: ' + i + ' already in column');
                    return;
                } else if (cells[Math.floor(row / inner_row_size) * (row_size * Math.floor(Math.sqrt(row_size))) + Math.floor(column / inner_row_size) * inner_row_size + (j % inner_row_size) + row_size * Math.floor(j / inner_row_size)].children[0].value === i.toString()) {
                    alert('Invalid placement: ' + i + ' already in sub grid');
                    return;
                }
            }
            element.value = i;
            verifySudoku();
            // Close popup after selection
            document.getElementById('numberPopup').style.display = 'none';
        });
        container.appendChild(numberDiv);
    }
}

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('numberPopup').style.display = 'none';
});