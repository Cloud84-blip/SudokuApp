import math
import random, sys

class SudokuGenerator:    
    def __init__(self, total_size=9, num_visible=25):
        self.board = []
        self.masked_board = []
        self.num_visible = num_visible
        self.size = total_size
        self.num_of_cells = total_size * total_size
        
    def is_valid(self, board, row, col, num):
        block_row, block_col = math.sqrt(self.size) * (row // math.sqrt(self.size)), math.sqrt(self.size) * (col // math.sqrt(self.size))
        for i in range(self.size):
            if board[row][i] == num or board[i][col] == num:
                return False
            if board[math.floor(block_row + i // math.sqrt(self.size))][math.floor(block_col + i % math.sqrt(self.size))] == num:
                return False
        return True

    def solve_sudoku(self, board, row=0, col=0):
        if row == self.size:
            return True
        if col == self.size:
            return self.solve_sudoku(board, row + 1, 0)
        if board[row][col] != 0:
            return self.solve_sudoku(board, row, col + 1)

        numbers = list(range(1, self.size + 1))
        random.shuffle(numbers)
        for num in numbers:
            if self.is_valid(board, row, col, num):
                board[row][col] = num
                if self.solve_sudoku(board, row, col + 1):
                    return True
                board[row][col] = 0
        return False

    def generate_sudoku(self):
        board = [[0] * self.size for _ in range(self.size)]
        if self.solve_sudoku(board):
            self.board = board
            return board
        return None

    def save_to_file(self, filename="sudoku_complete.txt"):
        with open(filename, "w") as file:
            file.write("==================\n")
            for line in self.board:
                file.write(" ");
                file.write(" ".join(map(str, line)) + " \n")
            file.write("==================\n")
            for line in self.masked_board:
                file.write(" ".join(map(str, line)) + " \n")
            file.write("==================\n")
                
    def generate_unique_pairs(self, N):
        if N > self.num_of_cells:  
            raise ValueError("")

        all_pairs = [(i, j) for i in range(0, self.size) for j in range(0, self.size)]
        unique_pairs = list(set(all_pairs))
        random.shuffle(unique_pairs)
        return unique_pairs[:N]

    def mask_board(self):
        masked_cells = self.generate_unique_pairs(self.num_of_cells-self.num_visible)
        self.masked_board = [row.copy() for row in self.board]
        for row, col in masked_cells:
            self.masked_board[row][col] = "X"
            
    def print_puzzle(self):
        for row in self.masked_board:
            row_to_print = [
                str(num) for num in row
            ]
            print(" ".join(row_to_print))
            

if __name__ == "__main__":
    if(len(sys.argv) < 2):
        print("Usage: python sudoku.py <size_of_board> <number_of_visible_cells>")
        sys.exit(1)
    sudoku = SudokuGenerator(int(sys.argv[1]) if len(sys.argv) > 1 else 25, int(sys.argv[2]))
    sudoku.generate_sudoku()
    sudoku.mask_board()
    sudoku.save_to_file()
    sudoku.print_puzzle()

