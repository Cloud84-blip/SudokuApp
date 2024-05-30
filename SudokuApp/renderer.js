function createSudokuGrid(nb_cells = 81) {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.classList.add('grid-template');
    const row_size = Math.sqrt(nb_cells);
    const subgrid_size = Math.sqrt(row_size);

    const fragment = document.createDocumentFragment();

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

            const centerX = (col + subgrid_size / 2) * cellWidth;
            const centerY = (row + subgrid_size / 2) * cellHeight;

            const translateX = window.innerWidth / 2 - centerX * scale + (cellWidth * Math.floor(Math.sqrt(subgrid_size)));
            const translateY = window.innerHeight / 2 - centerY * scale + (cellHeight * Math.floor(Math.sqrt(subgrid_size)));

            gridElement.style.transform = `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`;
        });

        // Add bold borders for subgrid boundaries
        if (Math.floor(i / row_size) % subgrid_size === subgrid_size - 1) {
            cell.classList.add('bold-bottom-border');
        }
        if (i % row_size % subgrid_size === subgrid_size - 1) {
            cell.classList.add('bold-right-border');
        }

        fragment.appendChild(cell);
    }

    gridElement.appendChild(fragment);

    document.getElementById('style-head').innerHTML = `
        .grid-container {
            overflow: auto; /* Enable scrolling */
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
            width: 20px;
        }

        .sudoku-cell:hover {
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

// Create a container for the grid and append it to the body
const gridContainer = document.getElementById('grid-container');
gridContainer.appendChild(document.getElementById('sudoku-grid'));

/**
 * Load the sudoku file
 */
window.electronAPI.loadFileAsync();

/**
 * Listen for the first line of the sudoku file to get the size of the grid
 */
window.electronAPI.listenFirstLine();
window.electronAPI.onFirstLineLoaded((line) => {
    const nb_of_cells = Math.pow(parseInt(line) - 1, 2);
    createSudokuGrid(nb_of_cells);
});

/**
 * Load the rest of the file
 */
window.electronAPI.listenFileLoaded();
window.electronAPI.onFileLoaded((sudoku) => {
    console.log('----> File loaded <---');

    const cells = document.getElementsByClassName('sudoku-cell');
    sudoku.split(' ').forEach((value, index) => {
        value = value.replace(/\n/g, '').replace("undefined", "");

        if (value === 'X') {
            cells[index].addEventListener('click', function(event) {
                document.getElementById('numberPopup').style.display = 'block';
                generateNumbers(event.target, index, cells.length);
            });
        }
        const anchor = document.createElement('a');
        anchor.textContent = (value === 'X') ? ' ' : value;
        anchor.readOnly = true;
        cells[index].appendChild(anchor);
    });
});