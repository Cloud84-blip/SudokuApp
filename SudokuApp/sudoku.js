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
                        console.log(rowSet, rowVal, rowSet.has(rowVal), i);
                        console.error(`Invalid placement: ${rowVal} already in row ${i}`);
                        return false;
                    }
                    rowSet.add(rowVal);
                }

                // Check if the current column value is valid
                if (colVal !== ' ') {
                    if (colSet.has(colVal)) {
                        console.log(colSet, colVal, `at pos ${i},${j}`);
                        console.error(`Invalid placement: ${colVal} already in column ${i + 1}`);
                        return false;
                    }
                    console.log("inserting -- ", colVal, "at pos", i, j, "in colSet");
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


document.getElementById('checkValidity').addEventListener('click', () => {
    verifySudoku();
});