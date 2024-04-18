import sys
import argparse
import random

def parse_args():
    parser = argparse.ArgumentParser(description="Generate a Sudoku puzzle of a specified size.")
    parser.add_argument("size", type=int, help="The size of the Sudoku grid (e.g., 9 for a 9x9 grid).")
    return parser.parse_args()

def initialize_grid(size):
    return [[0] * size for _ in range(size)]

def is_safe(grid, row, col, num):
    size = len(grid)
    block_size = int(size ** 0.5)

    # Check if the number is not already placed in the current row and column
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

def solve_sudoku(grid, row=0, col=0):
    size = len(grid)

    # If we reached the end of the grid, return True
    if row == size - 1 and col == size:
        return True
    # Move to the next row
    if col == size:
        row += 1
        col = 0

    # If the current position is already filled, continue with the next position
    if grid[row][col] > 0:
        return solve_sudoku(grid, row, col + 1)

    for num in range(1, size + 1):
        if is_safe(grid, row, col, num):
            grid[row][col] = num
            if solve_sudoku(grid, row, col + 1):
                return True
            grid[row][col] = 0

    return False

def print_grid(grid):
    for row in grid:
        print(" ".join(str(num) if num != 0 else "." for num in row))

def main():
    args = parse_args()
    size = args.size
    grid = initialize_grid(size)

    # Pre-fill some values to ensure a unique solution, this part can be customized
    fill_some_values(grid, size)

    if solve_sudoku(grid):
        print_grid(grid)
    else:
        print("Failed to generate a Sudoku puzzle with the given size:", size)

def fill_some_values(grid, size):
    attempts = size  # Adjust this based on size for complexity management
    while attempts > 0:
        row = random.randint(0, size - 1)
        col = random.randint(0, size - 1)
        num = random.randint(1, size)
        if grid[row][col] == 0 and is_safe(grid, row, col, num):
            grid[row][col] = num
            attempts -= 1

if __name__ == "__main__":
    main()
