const fs = require('fs');
const Jimp = require('jimp');

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
    }

    async drawGrid(image) {
        const black = Jimp.cssColorToHex('#000000');
        const lightBlueEven = Jimp.cssColorToHex('#e0f7fa');
        const lightBlueOdd = Jimp.cssColorToHex('#b3e5fc');

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const subgridX = Math.floor(i / this.subgridSize);
                const subgridY = Math.floor(j / this.subgridSize);
                const color = (subgridX % 2 === 0 && subgridY % 2 === 0) || (subgridX % 2 === 1 && subgridY % 2 === 1) ? lightBlueEven : lightBlueOdd;

                for (let x = i * this.cellSize; x < (i + 1) * this.cellSize; x++) {
                    for (let y = j * this.cellSize; y < (j + 1) * this.cellSize; y++) {
                        image.setPixelColor(color, x, y);
                    }
                }
            }
        }

        for (let i = 0; i <= this.gridSize; i++) {
            const strokeWidth = (i % this.subgridSize === 0) ? 4 : 1;

            for (let x = 0; x < this.canvasSize; x++) {
                for (let w = 0; w < strokeWidth; w++) {
                    image.setPixelColor(black, x, i * this.cellSize + w);
                }
            }

            for (let y = 0; y < this.canvasSize; y++) {
                for (let w = 0; w < strokeWidth; w++) {
                    image.setPixelColor(black, i * this.cellSize + w, y);
                }
            }
        }
    }

    async drawNumbers(image) {
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const number = this.sudokuGrid[i * this.gridSize + j];
                if (number !== 0) {
                    const textWidth = Jimp.measureText(font, number.toString());
                    const textHeight = Jimp.measureTextHeight(font, number.toString(), this.cellSize);
                    const x = j * this.cellSize + (this.cellSize - textWidth) / 2;
                    const y = i * this.cellSize + (this.cellSize - textHeight) / 2;
                    image.print(font, x, y, number.toString());
                }
            }
        }
    }

    async generateImage() {
        try {
            const image = new Jimp(this.canvasSize, this.canvasSize, Jimp.cssColorToHex('#ffffff'));

            await this.drawGrid(image);
            await this.drawNumbers(image);

            await image.writeAsync(this.outputFileName);
            console.log('Image was created successfully.');
            return this.outputFileName;
        } catch (err) {
            console.error('Error during image generation: ', err);
            throw err;
        }
    }
}

module.exports = SudokuImageGenerator;
