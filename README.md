### Repository for Sudoku front interface

- To run:
```
cd SudokuApp
npm install
npm run start
```

click on "Load Sudoku" button and choose a file ( sudoku_grid_49.txt, sudoku_grid_64.txt, or any file generated by the Solver )

To create executable:
```
npm run dist -- -w //for Windows
npm run dist -- -m //for Macos
npm run dist -- -l //for Linux
```
and run executable inside dist/ folder
