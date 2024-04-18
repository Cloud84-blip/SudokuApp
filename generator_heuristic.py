import sys
import argparse
import random

def parse_args():
    parser = argparse.ArgumentParser(description="Generate a Sudoku puzzle of a specified size.")
    parser.add_argument("size", type=int, help="The size of the Sudoku grid (e.g., 25 for a 25x25 grid).")
    return parser.parse_args()

def initialize_grid(size):
    return [[0] * size for _ in range(size)]

def is_safe(grid, row, col, num):
    size = len(grid)
    block_size = int(size ** 0.5)

    # Check row and column
    for x in range(size):
        if grid[row][x] == num or grid[x][col] == num:
            return False

    # Check the square
    start_row = row - row % block_size
    start_col = col - col % block_size
    for i in range(block_size):
        for j in range(block_size):
            if grid[i + start_row][j + start_col] == num:
                return False

    return True

def find_least_constrained_cell(grid):
    size = len(grid)
    min_options = size + 1
    cell = None
    for r in range(size):
        for c in range(size):
            if grid[r][c] == 0:
                options = sum(is_safe(grid, r, c, num) for num in range(1, size + 1))
                if options < min_options:
                    min_options = options
                    cell = (r, c)
    return cell

def solve_sudoku(grid):
    cell = find_least_constrained_cell(grid)
    if not cell:
        return True  # Puzzle completed
    row, col = cell

    size = len(grid)
    for num in range(1, size + 1):
        if is_safe(grid, row, col, num):
            grid[row][col] = num
            if solve_sudoku(grid):
                return True
            grid[row][col] = 0

    return False

def print_grid(grid):
    size = len(grid)
    block_size = int(size ** 0.5)
    for i, row in enumerate(grid):
        if i % block_size == 0 and i != 0:
            print("-" * (size * 2 + block_size - 1))
        for j, val in enumerate(row):
            if j % block_size == 0 and j != 0:
                print("| ", end="")
            print(val if val != 0 else ".", end=" ")
        print()

def main():
    args = parse_args()
    size = args.size
    grid = initialize_grid(size)
    if solve_sudoku(grid):
        print_grid(grid)
    else:
        print("Failed to generate a Sudoku puzzle with the given size:", size)

if __name__ == "__main__":
    main()
