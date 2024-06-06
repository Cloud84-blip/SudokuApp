const fs = require('fs');
const sharp = require('sharp');

class SudokuImageGenerator {
    constructor(filePath, outputFileName) {
        this.filePath = filePath;
        this.outputFileName = outputFileName;
        this.fileContent = fs.readFileSync(this.filePath, 'utf-8');
        this.sudokuGrid = this.fileContent.trim().split(/\s+/).map(Number);
        this.gridSize = Math.sqrt(this.sudokuGrid.length);
        this.subgridSize = Math.sqrt(this.gridSize);
        this.cellSize = 50;
        this.canvasSize = this.gridSize * this.cellSize;
        this.svgHeader = `<svg width="${this.canvasSize}" height="${this.canvasSize}" xmlns="http://www.w3.org/2000/svg">`;
        this.svgFooter = `</svg>`;
        this.svgContent = '';
    }

    drawGrid() {
        for (let i = 0; i <= this.gridSize; i++) {
            const strokeWidth = (i % this.subgridSize === 0) ? 2 : 1;
            const color = "#000";

            // Lignes horizontales
            this.svgContent += `<line x1="0" y1="${i * this.cellSize}" x2="${this.canvasSize}" y2="${i * this.cellSize}" stroke="${color}" stroke-width="${strokeWidth}"/>`;

            // Lignes verticales
            this.svgContent += `<line x1="${i * this.cellSize}" y1="0" x2="${i * this.cellSize}" y2="${this.canvasSize}" stroke="${color}" stroke-width="${strokeWidth}"/>`;
        }
    }

    drawNumbers() {
        const fontSize = 24;
        const fontColor = "#000";
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const number = this.sudokuGrid[i * this.gridSize + j];
                if (number !== 0) {
                    const x = j * this.cellSize + this.cellSize / 2;
                    const y = i * this.cellSize + this.cellSize / 2 + fontSize / 3; // Ajuster pour centrer verticalement
                    this.svgContent += `<text x="${x}" y="${y}" font-size="${fontSize}" fill="${fontColor}" text-anchor="middle" dominant-baseline="middle">${number}</text>`;
                }
            }
        }
    }

    generateImage() {
        this.drawGrid();
        this.drawNumbers();

        const svg = this.svgHeader + this.svgContent + this.svgFooter;

        sharp(Buffer.from(svg))
            .toFile(this.outputFileName, (err, info) => {
                if (err) {
                    console.error('Erreur lors de la génération de l\'image:', err);
                } else {
                    console.log('L\'image Sudoku a été créée:', info);
                }
            });
    }
}

module.exports = SudokuImageGenerator;
