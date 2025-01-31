document.addEventListener('DOMContentLoaded', () => {
    const welcomePage = document.getElementById('welcomePage');
    const gamePage = document.getElementById('gamePage');
    const cellContainer = document.getElementById('cellContainer');
    const restartBtn = document.getElementById('restartBtn');
    const pvpMode = document.getElementById('pvpMode');
    const pvcMode = document.getElementById('pvcMode');
    const statusText = document.getElementById('statusText');
    const countdownText = document.getElementById('countDown');

    let isSinglePlayer = false;
    let currentPlayer = 'black';
    let isGameActive = true;
    let countdownInterval;

    // Transition to game page when mode is selected
    pvpMode.addEventListener('click', () => {
        isSinglePlayer = false;
        startGame();
    }); 

    pvcMode.addEventListener('click', () => {
        isSinglePlayer = true;
        startGame();
    });

    function startGame() {
        welcomePage.style.display = 'none'; // Hide welcome page
        gamePage.style.display = 'block'; // Show game page
        initializeGame(isSinglePlayer); // Initialize the game
    }

    function initializeGame(isSinglePlayer = false) {
        const numberOfCells = 100;

        // Create game cells dynamically
        createCells(cellContainer, numberOfCells);

        const cells = document.querySelectorAll('.cell');
        setupCellClickEvent(cells, statusText, countdownText, isSinglePlayer);

        restartBtn.addEventListener('click', () => resetGame(cells, statusText, countdownText));

        updateStatusText(statusText, currentPlayer);
        startTimer(countdownText);
    }

    function createCells(container, numberOfCells) {
        container.innerHTML = ''; // Clear any existing cells
        for (let i = 0; i < numberOfCells; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('cellIndex', i);
            cell.className = 'cell';
            container.appendChild(cell);
        }
    }

    function setupCellClickEvent(cells, statusText, countdownText, isSinglePlayer) {
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                if (!isGameActive || cell.style.backgroundColor === 'black' || cell.style.backgroundColor === 'yellow') {
                    return;
                }

                cell.style.backgroundColor = currentPlayer;

                if (checkWin(cell, currentPlayer, cells)) {
                    setTimeout(() => {
                        statusText.textContent = `${currentPlayer} wins!`;
                        clearInterval(countdownInterval);
                        isGameActive = false;
                    }, 100);
                } else {
                    currentPlayer = (currentPlayer === 'black') ? 'yellow' : 'black';
                    updateStatusText(statusText, currentPlayer);
                    restartTimer(countdownText);

                    if (isSinglePlayer && currentPlayer === 'yellow') {
                        setTimeout(() => computerMove(cells, statusText, countdownText), 500);
                    }
                }
            });
        });
    }

    function computerMove(cells, statusText, countdownText) {
        const availableCells = Array.from(cells).filter(cell => !cell.style.backgroundColor);
        if (availableCells.length === 0) return;

        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        randomCell.style.backgroundColor = 'yellow';

        if (checkWin(randomCell, 'yellow', cells)) {
            setTimeout(() => {
                statusText.textContent = 'yellow wins!';
                clearInterval(countdownInterval);
                isGameActive = false;
            }, 100);
        } else {
            currentPlayer = 'black';
            updateStatusText(statusText, currentPlayer);
            restartTimer(countdownText);
        }
    }

    function checkWin(cell, color, cells) {
        const index = Array.from(cells).indexOf(cell);
        const row = Math.floor(index / 10); // A 10x10 grid
        const col = index % 10;

        return (
            checkDirection(row, col, 1, 0, color, cells) || // Horizontal
            checkDirection(row, col, 0, 1, color, cells) || // Vertical
            checkDirection(row, col, 1, 1, color, cells) || // Diagonal /
            checkDirection(row, col, 1, -1, color, cells) // Diagonal \
        );
    }

    function checkDirection(row, col, rowIncrement, colIncrement, color, cells) {
        let count = 1;

        // Check in positive direction
        for (let i = 1; i < 5; i++) {
            const newRow = row + i * rowIncrement;
            const newCol = col + i * colIncrement;
            if (isInBounds(newRow, newCol) && getCell(newRow, newCol, cells).style.backgroundColor === color) {
                count++;
            } else {
                break;
            }
        }

        // Check in negative direction
        for (let i = 1; i < 5; i++) {
            const newRow = row - i * rowIncrement;
            const newCol = col - i * colIncrement;
            if (isInBounds(newRow, newCol) && getCell(newRow, newCol, cells).style.backgroundColor === color) {
                count++;
            } else {
                break;
            }
        }

        return count >= 5;
    }

    function isInBounds(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 10;
    }

    function getCell(row, col, cells) {
        return cells[row * 10 + col];
    }

    function resetGame(cells, statusText, countdownText) {
        clearInterval(countdownInterval); // Stop any existing timer
        cells.forEach(cell => {
            cell.style.backgroundColor = 'skyblue'; // Clear the background color
        });
        currentPlayer = 'black'; // Reset the starting color
        isGameActive = true; // Enable the game
        updateStatusText(statusText, currentPlayer); // Update the status text to reflect the current player
        startTimer(countdownText); // Start a new timer
    }

    function updateStatusText(statusText, playingColor) {
        statusText.textContent = `${playingColor}, Play!`;
    }

    function startTimer(countdownText) {
        let timeLeft = 15;

        countdownInterval = setInterval(() => {
            if (!isGameActive) {
                clearInterval(countdownInterval);
                return;
            }

            countdownText.textContent = `Time Left: ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                const winner = currentPlayer === 'black' ? 'yellow' : 'black';
                statusText.textContent = `${winner} wins due to time limit!`;
                isGameActive = false; // End the game
            }

            timeLeft--;
        }, 1000);
    }

    function restartTimer(countdownText) {
        clearInterval(countdownInterval);
        if (isGameActive) {
            startTimer(countdownText);
        }
    }
});
