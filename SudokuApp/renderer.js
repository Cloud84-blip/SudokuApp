function createSudokuGrid(nb_cells = 81, initialScale = 0.3) {
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

            const scale = 0.8;

            // Capture mouse position
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            let translateX;
            let translateY;

            // console.log(`${subgrid_index} < ${Math.floor(Math.sqrt(row_size))} ? ${ subgrid_index < Math.floor(Math.sqrt(row_size)) } `);
            // console.log(`${ subgrid_index >= 0 && subgrid_index < Math.floor(Math.sqrt(row_size))  } `);
            // if (subgrid_index >= Math.floor(Math.sqrt(row_size)) * 2 && subgrid_index < Math.floor(Math.sqrt(row_size)) * 4)
            console.log(`${subgrid_index % Math.floor(Math.sqrt(row_size))}`)
            if (subgrid_index >= 0 && subgrid_index < Math.floor(Math.sqrt(row_size)) * 2) {
                // first row of subgrid
                // Calculate translation
                console.log('Y + 500');
                translateX = (window.innerWidth / 2 - mouseX) / scale;
                translateY = (window.innerHeight / 2 - mouseY) / scale + 500;
            } else if (subgrid_index >= Math.floor(Math.sqrt(row_size)) * 2 && subgrid_index < Math.floor(Math.sqrt(row_size)) * 4) {
                console.log('Y + 200');
                translateX = (window.innerWidth / 2 - mouseX) / scale;
                translateY = (window.innerHeight / 2 - mouseY) / scale + 200;
            }  else  {
                console.log('Y - 200');
                translateX = (window.innerWidth / 2 - mouseX) / scale;
                translateY = (window.innerHeight / 2 - mouseY) / scale - 200;
            }

            if(subgrid_index % Math.floor(Math.sqrt(row_size)) === 7) {
                translateX -= 200;
            } else if (subgrid_index % Math.floor(Math.sqrt(row_size)) === 0) {
                translateX += 200;
            }


            gridElement.style.transform = `scale(0.8) translate(${translateX}px, ${translateY}px)`;
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

    // Set initial zoom
    gridElement.style.transform = `scale(${initialScale}) translateY(15vh)`;

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
            top: 0;
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
        console.log(value, value.length);
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
