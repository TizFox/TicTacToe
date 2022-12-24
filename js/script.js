var playerSymbol = '<span class="fa-regular fa-circle fa-6x symbol"></span>'
var AISymbol = '<span class="fa-solid fa-xmark fa-8x symbol"></span>'

var grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]; // 0 --> Void | 1 --> Player | 2 --> AI
var win = [false, []];

function checkWin(board) {
    // Rows
    if (board[0][0] != 0 && board[0][1] != 0 && board[0][2] != 0)
        if (board[0][0] == board[0][1] && board[0][1] == board[0][2])
            return [true, ["00", "01", "02"]];
    if (board[1][0] != 0 && board[1][1] != 0 && board[1][2] != 0)
        if (board[1][0] == board[1][1] && board[1][1] == board[1][2])
            return [true, ["10", "11", "12"]];
    if (board[2][0] != 0 && board[2][1] != 0 && board[2][2] != 0)
        if (board[2][0] == board[2][1] && board[2][1] == board[2][2])
            return [true, ["20", "21", "22"]];

    // Cols
    if (board[0][0] != 0 && board[1][0] != 0 && board[2][0] != 0)
        if (board[0][0] == board[1][0] && board[1][0] == board[2][0])
            return [true, ["00", "10", "20"]];
    if (board[0][1] != 0 && board[1][1] != 0 && board[2][1] != 0)
        if (board[0][1] == board[1][1] && board[1][1] == board[2][1])
            return [true, ["01", "11", "21"]];
    if (board[0][2] != 0 && board[1][2] != 0 && board[2][2] != 0)
        if (board[0][2] == board[1][2] && board[1][2] == board[2][2])
            return [true, ["02", "12", "22"]];

    // Diagonals
    if (board[0][0] != 0 && board[1][1] != 0 && board[2][2] != 0)
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2])
            return [true, ["00", "11", "22"]];
    if (board[2][0] != 0 && board[1][1] != 0 && board[0][2] != 0)
        if (board[2][0] == board[1][1] && board[1][1] == board[0][2])
            return [true, ["20", "11", "02"]];
    
    return [false, []];
}

function isAllFull(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

function playerChoice(cell) {
    if (!win[0]) {
        var i = cell.charAt(3);
        var j = cell.charAt(4);

        var playerButton = document.getElementById(cell);

        if (grid[i][j] == 0) {
            grid[i][j] = 1;
            playerButton.innerText = "O";

            win = checkWin(grid)
            if (win[0]) {
                for (var i = 0; i < 3; i++) {
                    var winnerCell = document.getElementById("box" + win[1][i]);
                    winnerCell.style.color = "#7DEB51";
                }
            }


            if (isAllFull(grid) && !win[0]) {
                win = [true, []];
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        var winnerCell = document.getElementById("box" + String(i) + String(j));
                        winnerCell.style.color = "#767676";
                    }
                }
            }

            AIChoice();
        
            win = checkWin(grid)
            if (win[0]) {
                for (var i = 0; i < 3; i++) {
                    var winnerCell = document.getElementById("box" + win[1][i]);
                    winnerCell.style.color = "#7DEB51";
                }
            }

            if (isAllFull(grid)  && !win[0]) {
                win = [true, []];
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        var winnerCell = document.getElementById("box" + String(i) + String(j));
                        winnerCell.style.color = "#969696";
                    }
                }
            }
        }
    }
}

// --- AI --- //
function AIChoice() {
    var i = 0, j = 0;

    // MiniMax
    var move = bestMove(grid);

    i = move[0];
    j = move[1];
    if (i != null && j != null) {
        // Update Grid
        grid[i][j] = 2;
        var AIButton = document.getElementById("box" + String(i) + String(j));
        AIButton.innerText = "X";
    }
}

function bestMove(board) {
    var bestScore = -100;
    var move = [null, null];

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] == 0) {
                board[i][j] = 2;
                var score = minimax(board, 0, false);
                board[i][j] = 0;
                if (score > bestScore) {
                    bestScore = score;
                    move = [i, j];
                }
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximising) {
    var score = checkBoard(board);
    if (score != null) {
        return score;
    }

    if (isMaximising) {
        var bestScore = -100;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    board[i][j] = 2;
                    score = minimax(board, depth + 1, false);
                    board[i][j] = 0;
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
    } else {
        var bestScore = 100;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == 0) {
                    board[i][j] = 1;
                    score = minimax(board, depth + 1, true);
                    board[i][j] = 0;
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
    }
    return bestScore;
}

function checkBoard(board) {
    var score = null;

    if (isAllFull(board))
        score = 0;
    
    winner = checkWin(board);
    if (winner[0]) {
        winner = winner[1][0];
        
        // AI Wins?
        if (board[winner[0]][winner[1]] == 2)
            score = 1;
    
        // Player Wins?
        if (board[winner[0]][winner[1]] == 1)
            score = -1;
    }
    return score;
    
}
