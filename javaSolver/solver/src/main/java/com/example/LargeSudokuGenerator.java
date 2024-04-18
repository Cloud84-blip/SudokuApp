package com.example;

import java.io.FileWriter;
import java.io.IOException;

import org.chocosolver.solver.Model;
import org.chocosolver.solver.variables.IntVar;
import org.chocosolver.solver.search.strategy.Search;
import org.chocosolver.util.tools.ArrayUtils;

public class LargeSudokuGenerator {

    public static void main(String[] args) {
        int size = 49;  // Size of the Sudoku grid
        solveSudokuNaive(size);
        //solveSudoku(size);
    }

    private static void solveSudokuNaive(int size) {
        Model model = new Model(size + "-sudoku problem");
        IntVar[][] vars = model.intVarMatrix("Sudoku", size, size, 1, size);

        // Row and column constraints
        for (int i = 0; i < size; i++) {
            model.allDifferent(vars[i]).post(); // Rows must be all different
            IntVar[] column = new IntVar[size];
            for (int j = 0; j < size; j++) {
                column[j] = vars[j][i];
            }
            model.allDifferent(column).post(); // Columns must be all different
        }

        // Sub-grid constraints
        int subGridSize = (int) Math.sqrt(size);
        for (int blockRow = 0; blockRow < size; blockRow += subGridSize) {
            for (int blockCol = 0; blockCol < size; blockCol += subGridSize) {
                IntVar[] subGrid = new IntVar[size];
                for (int k = 0; k < subGridSize; k++) {
                    for (int l = 0; l < subGridSize; l++) {
                        subGrid[k * subGridSize + l] = vars[blockRow + k][blockCol + l];
                    }
                }
                model.allDifferent(subGrid).post();
            }
        }

        // Solve the Sudoku
        if (model.getSolver().solve()) {
            try {
                saveSudokuToFile(vars, size, "sudoku_output.txt");
            } catch (IOException e) {
                System.out.println("Failed to write to file: " + e.getMessage());
            }
        } else {
            System.out.println("No solution found.");
        }
    }

    private static void solveSudoku(int size) {
        Model model = new Model(size + "-sudoku problem");
        IntVar[][] vars = model.intVarMatrix("Sudoku", size, size, 1, size);

        // Row and column constraints
        for (int i = 0; i < size; i++) {
            model.allDifferent(vars[i]).post(); // Rows must be all different
            IntVar[] column = new IntVar[size];
            for (int j = 0; j < size; j++) {
                column[j] = vars[j][i];
            }
            model.allDifferent(column).post(); // Columns must be all different
        }

        // Sub-grid constraints
        int subGridSize = (int) Math.sqrt(size);
        for (int blockRow = 0; blockRow < size; blockRow += subGridSize) {
            for (int blockCol = 0; blockCol < size; blockCol += subGridSize) {
                IntVar[] subGrid = new IntVar[size];
                for (int k = 0; k < subGridSize; k++) {
                    for (int l = 0; l < subGridSize; l++) {
                        subGrid[k * subGridSize + l] = vars[blockRow + k][blockCol + l];
                    }
                }
                model.allDifferent(subGrid).post();
            }
        }

        // Randomizing the decision strategy
        IntVar[] varsFlat = ArrayUtils.flatten(vars);
        model.getSolver().setSearch(Search.randomSearch(varsFlat, System.currentTimeMillis()));

        // Solve the Sudoku
        // Solve the Sudoku
        if (model.getSolver().solve()) {
            try {
                saveSudokuToFile(vars, size, "sudoku_output.txt");
            } catch (IOException e) {
                System.out.println("Failed to write to file: " + e.getMessage());
            }
        } else {
            System.out.println("No solution found.");
        }
    }

    private static void saveSudokuToFile(IntVar[][] vars, int size, String fileName) throws IOException {
        FileWriter writer = new FileWriter(fileName);
        writer.write("==================\n");
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                writer.write(vars[i][j].getValue() + " ");
            }
            writer.write("\n");
        }
        writer.write("==================\n");
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                writer.write(vars[i][j].getValue() + " ");
            }
            writer.write("\n");
        }
        writer.close();
        System.out.println("Sudoku saved to " + fileName);
    }
}
