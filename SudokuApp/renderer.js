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
        gap: 1px; grid-template-columns: repeat(${Math.floor(Math.sqrt(nb_cells))}, 50px); }`;
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
            if (value.length === 2) {
                value = value[1];
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


function verifySudoku(nb_cells = 81) {
    const cells = document.getElementsByClassName('sudoku-cell');
    let sudoku = '';
    for (let i = 0; i < nb_cells; i++) {
        sudoku += cells[i].children[0].value;
    }
    if (sudoku === solution) {
        alert('Congratulations! You have solved the sudoku');
    } else {
        console.log("sudoku not complete yet");
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