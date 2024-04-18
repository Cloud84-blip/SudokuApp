document.getElementById('checkValidity').addEventListener('click', () => {
    verifySudoku();
});

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '=') {
        window.electronAPI.zoomIn();
    } else if (event.ctrlKey && event.key === '-') {
        window.electronAPI.zoomOut();
    } else if (event.ctrlKey && event.key === '0') {
        window.electronAPI.resetZoom();
    }
});





let solution;
/*  
 * Create the sudoku grid
 * @return {void}
 */

function createSudokuGrid(nb_cells = 81) {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.classList.add('grid-template');
    console.log(nb_cells);
    for (let i = 0; i < nb_cells; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        const row_size = Math.floor(Math.sqrt(nb_cells));

        if ((i % (row_size * Math.floor(Math.sqrt(row_size)))) >= (row_size * Math.floor(Math.sqrt(row_size))) - row_size) {
            cell.classList.add('bold-bottom-border');
        }
        if (i % Math.floor(Math.sqrt(row_size)) === Math.floor(Math.sqrt(row_size)) - 1) {
            cell.classList.add('bold-right-border');
        }

        const input = document.createElement('input');
        input.type = 'text';
        //input.maxLength = 1;
        input.oninput = function() {
            this.value = this.value.replace(/[^1-9]+/g, '');
        };

        cell.appendChild(input);
        gridElement.appendChild(cell);

    }
    const style = document.getElementById('style-head');
    style.innerHTML = `.grid-template {display: grid;
        gap: 3px; grid-template-columns: repeat(${Math.floor(Math.sqrt(nb_cells))}, 50px); }`;
}

/*
 * Load the sudoku file
 * @return {void}
 */

function loadFile() {
    const data = window.electronAPI.loadFile();
    data.then((sudoku) => {
        const nb_of_cells = sudoku.split('==================')[2].split(' ').length - 1;
        createSudokuGrid(nb_of_cells);
        const cells = document.getElementsByClassName('sudoku-cell');
        solution = sudoku.split('==================')[1];
        sudoku.split('==================')[2].split(' ').forEach((value, index) => {
            if (value.includes('\n')) {
                value = value.replace('\n', '');
            }
            if (value === 'X') {
                cells[index].addEventListener('click', function(event) {
                    document.getElementById('numberPopup').style.display = 'block';
                    generateNumbers(event.target, index, nb_of_cells);
                });
            }
            cells[index].children[0].value = (value === 'X') ? ' ' : value;
            cells[index].children[0].readOnly = true;

        });
    });
}

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

loadFile();


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