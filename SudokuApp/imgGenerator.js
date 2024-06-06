const fs = require('fs');
const { createCanvas } = require('canvas');

class ImgGenerator {
    path;
    fileContent;
    sudokuGrid;
    gridSize;
    subgridSize;
    cellSize;
    canvasSize;
    canvas;
    ctx;
    constructor(path){
        this.path = path;
        this.loadFile();
        this.init();
    }

    loadFile(){
        this.fileContent = fs.readFileSync(this.path, 'utf-8');
    }

    init(){
        this.sudokuGrid = fileContent.trim().split(/\s+/).map(Number);
        this.gridSize =  Math.sqrt(sudokuGrid.length);
        this.subgridSize = Math.sqrt(this.gridSize);
        this.cellSize = 50;
        this.canvasSize = this.gridSize * this.cellSize;
        this.canvas = createCanvas(this.canvasSize, this.canvasSize);
        this.ctx = this.canvas.getContext('2d');
    }

    drawGrid() {
        this.ctx.strokeStyle = '#000';
        for (let i = 0; i <= this.gridSize; i++) {
            const lineWidth = (i % this.subgridSize === 0) ? 2 : 1;
            this.ctx.lineWidth = lineWidth;
    
            // horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.cellSize);
            this.ctx.lineTo(this.canvasSize, i * this.cellSize);
            this.ctx.stroke();
    
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.cellSize, 0);
            this.ctx.lineTo(i * this.cellSize, this.canvasSize);
            this.ctx.stroke();
        }
    }

    drawNumbers() {
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const number = this.sudokuGrid[i * this.gridSize + j];
                if (number !== 0) {
                    const x = j * this.cellSize + this.cellSize / 2;
                    const y = i * this.cellSize + this.cellSize / 2;
                    this.ctx.fillText(number, x, y);
                }
            }
        }
    }

    generate(){
        const out = fs.createWriteStream('sudoku.png');
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => console.log('Sudoku image was created'));
    }
}



module.exports = ImgGenerator;

drawGrid();
drawNumbers();


