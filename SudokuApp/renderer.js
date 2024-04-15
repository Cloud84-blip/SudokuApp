let solution;


function createSudokuGrid() {
    const gridElement = document.getElementById('sudoku-grid');
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';

        console.log(i % 27)
        if ((i % 27 >= 18)) {
            cell.classList.add('bold-bottom-border');
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.oninput = function() {
            this.value = this.value.replace(/[^1-9]/g, '');
        };

        cell.appendChild(input);
        gridElement.appendChild(cell);
    }
}

function loadFile() {
    const data = window.electronAPI.loadFile();
    data.then((sudoku) => {
        createSudokuGrid();
        const cells = document.getElementsByClassName('sudoku-cell');
        solution = sudoku.split('==================')[1];
        console.log(solution)
        sudoku.split('==================')[2].split(' ').forEach((value, index) => {
            if (value.length === 2) {
                value = value[1];
            }
            if (value === 'X') {
                cells[index].addEventListener('click', function(event) {
                    document.getElementById('numberPopup').style.display = 'block';
                    generateNumbers(event.target, index);
                });
            }
            cells[index].children[0].value = (value === 'X') ? ' ' : value;
            cells[index].children[0].readOnly = true;

        });
    });
}

function verifySudoku() {
    const cells = document.getElementsByClassName('sudoku-cell');
    let sudoku = '';
    for (let i = 0; i < 81; i++) {
        sudoku += cells[i].children[0].value;
    }
    if (sudoku === solution) {
        alert('Congratulations! You have solved the sudoku');
    } else {
        console.log("sudoku not complete yet");
    }
}

loadFile();


function generateNumbers(element, index) {
    const container = document.querySelector('.number-grid');
    console.log(element)
    let row = Math.floor(index / 9);
    let column = index % 9;
    container.innerHTML = ''; // Clear previous numbers if any
    element.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        numberDiv.addEventListener('click', function() {
            const cells = document.getElementsByClassName('sudoku-cell');
            // if there is the same number in the row, column or 3x3 grid, don't allow the user to place the number
            for (let j = 0; j < 9; j++) {
                if (cells[row * 9 + j].children[0].value === i.toString()) {
                    alert('Invalid placement: ' + i + ' already in row');
                } else if (cells[j * 9 + column].children[0].value === i.toString()) {
                    alert('Invalid placement: ' + i + ' already in column');
                    return;
                } else if (cells[Math.floor(row / 3) * 27 + Math.floor(column / 3) * 3 + (j % 3) + 9 * Math.floor(j / 3)].children[0].value === i.toString()) {
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