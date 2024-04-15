import random, sys

class SudokuGenerator:    
    def __init__(self, num_visible=25):
        self.board = []
        self.masked_board = []
        self.num_visible = num_visible
        
    def is_valid(self, board, row, col, num):
        block_row, block_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(9):
            if board[row][i] == num or board[i][col] == num:
                return False
            if board[block_row + i // 3][block_col + i % 3] == num:
                return False
        return True

    def solve_sudoku(self, board, row=0, col=0):
        if row == 9:
            return True
        if col == 9:
            return self.solve_sudoku(board, row + 1, 0)
        if board[row][col] != 0:
            return self.solve_sudoku(board, row, col + 1)

        numbers = list(range(1, 10))
        random.shuffle(numbers)
        for num in numbers:
            if self.is_valid(board, row, col, num):
                board[row][col] = num
                if self.solve_sudoku(board, row, col + 1):
                    return True
                board[row][col] = 0
        return False

    def generate_sudoku(self):
        board = [[0] * 9 for _ in range(9)]
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
        if N > 81:  
            raise ValueError("")

        all_pairs = [(i, j) for i in range(0, 9) for j in range(0, 9)]
        unique_pairs = list(set(all_pairs))
        random.shuffle(unique_pairs)
        return unique_pairs[:N]

    def mask_board(self):
        masked_cells = self.generate_unique_pairs(81-self.num_visible)
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
    sudoku = SudokuGenerator(int(sys.argv[1]) if len(sys.argv) > 1 else 25)
    sudoku.generate_sudoku()
    sudoku.mask_board()
    sudoku.save_to_file()
    sudoku.print_puzzle()

