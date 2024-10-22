let board = [];
let currentPlayer = '';
let botPlayer = '';
let gameOver = false;

let playerScore = 0;
let computerScore = 0;

function chooseSymbol(symbol) {
    currentPlayer = symbol;
    botPlayer = symbol === 'X' ? 'O' : 'X';
    document.querySelector('#message').innerText = `Siz ${symbol} tanladingiz. O'yin boshlanadi!`;
    document.querySelector('.button-container').style.display = 'none';
    initializeBoard();
}

function initializeBoard() {
    board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    renderBoard();
}

function renderBoard() {
    const boardElement = document.querySelector('#board');
    boardElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.innerText = board[i][j] === ' ' ? '' : board[i][j];
            cell.addEventListener('click', () => handleMove(i, j));
            boardElement.appendChild(cell);
        }
    }
}

function handleMove(x, y) {
    if (gameOver || board[x][y] !== ' ') return;

    board[x][y] = currentPlayer;
    renderBoard();

    if (checkWinner()) {
        document.querySelector('#message').innerText = `${currentPlayer} yutdi! O'yin tugadi.`;
        endGame('player');
        return;
    }

    if (isDraw()) {
        document.querySelector('#message').innerText = 'Durrang! O\'yin tugadi.';
        endGame('draw');
        return;
    }

    botMove();
}

function botMove() {
    const bestMove = findBestMove();
    if (bestMove) {
        board[bestMove[0]][bestMove[1]] = botPlayer;
        renderBoard();

        if (checkWinner()) {
            document.querySelector('#message').innerText = `${botPlayer} yutdi! O'yin tugadi.`;
            endGame('computer');
        } else if (isDraw()) {
            document.querySelector('#message').innerText = 'Durrang! O\'yin tugadi.';
            endGame('draw');
        }
    }
}

function checkWinner() {
    const lines = [
        ...board,
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
    ];

    for (let line of lines) {
        if (line[0] !== ' ' && line.every(cell => cell === line[0])) {
            return true;
        }
    }

    return false;
}

function isDraw() {
    return board.flat().every(cell => cell !== ' ');
}

function findBestMove() {
    let emptyCells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === ' ') {
                emptyCells.push([i, j]);
            }
        }
    }

    return emptyCells.length ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function restartGame() {
    document.querySelector('#message').innerText = 'X yoki O tanlang!';
    document.querySelector('.button-container').style.display = 'block';
    document.querySelector('#restart').style.display = 'block';
    gameOver = false;
    initializeBoard();
}

// O'yinni tugatib, natijaga qarab ballarni yangilash
function endGame(result) {
    if (result === 'player') {
        playerScore += 1;
        document.querySelector('#message').innerText += ` Sizga 1 ball qo'shildi!`;
    } else if (result === 'computer') {
        computerScore += 1;
        document.querySelector('#message').innerText += ` Kompyuterga 1 ball qo'shildi!`;
    } else if (result === 'draw') {
        playerScore += 0.5;
        computerScore += 0.5;
        document.querySelector('#message').innerText += ` Har ikkalangizga 0.5 ball qo'shildi!`;
    }
    gameOver = true;
    document.querySelector('#restart').style.display = 'block';
    updateScore();
}

// Scorelarni yangilovchi funksiya
function updateScore() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
}

// O'yinni qayta boshlash tugmasi
document.getElementById('restart').addEventListener('click', function() {
    restartGame();
});
