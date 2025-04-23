const Gameboard = (function () {
    const board = [];

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];

            for (let j = 0; j < 3; j++) {
                board[i].push(0);
            }
        }
    };
    resetBoard();

    const placeSymbol = (player, row, column) =>
        (board[row][column] = player.symbol);

    const isGameTied = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };

    const getWinner = () => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (
                board[i][0] == board[i][1] &&
                board[i][0] == board[i][2] &&
                board[i][0]
            ) {
                return GameController.player1.symbol == board[i][0]
                    ? GameController.player1
                    : GameController.player2;
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (
                board[0][i] == board[1][i] &&
                board[0][i] == board[2][i] &&
                board[0][i]
            ) {
                return GameController.player1.symbol == board[0][i]
                    ? GameController.player1
                    : GameController.player2;
            }
        }

        // Check left diagonals
        if (
            board[0][0] == board[1][1] &&
            board[0][0] == board[2][2] &&
            board[0][0]
        ) {
            return GameController.player1.symbol == board[0][0]
                ? GameController.player1
                : GameController.player2;
        }

        // Check right diagonals
        if (
            board[0][2] == board[1][1] &&
            board[0][2] == board[2][0] &&
            board[0][2]
        ) {
            return GameController.player1.symbol == board[0][2]
                ? GameController.player1
                : GameController.player2;
        }
    };

    return { board, placeSymbol, resetBoard, isGameTied, getWinner };
})();

function Player(name, symbol) {
    function setName(newName) {
        this.name = newName;
    }

    return { setName, name, symbol };
}

const GameController = (function () {
    const player1 = Player("Player 1", "x");
    const player2 = Player("Player 2", "o");

    let activePlayer = player1;

    const setActivePlayer = () => {
        activePlayer = activePlayer == player1 ? player2 : player1;
    };

    const playRound = (row, column) => {
        if (!Gameboard.board[row][column]) {
            Gameboard.placeSymbol(activePlayer, row, column);
            console.log(
                `${activePlayer.symbol} placed at row ${row} column ${column}.`
            );

            let winner = Gameboard.getWinner();

            if (winner) {
                console.log(`${winner.name} is the winner!`);
                console.log(Gameboard.board);
                resetGame(winner);
            } else if (Gameboard.isGameTied()) {
                console.log("It's a tie!");
                resetGame("tie");
            } else {
                setActivePlayer();
            }

            ScreenController.updateDisplay(activePlayer);
        }
    };

    const resetGame = (winner = "") => {
        activePlayer = player1;
        Gameboard.resetBoard();
        ScreenController.refreshDisplay();
        ScreenController.updateDisplay(activePlayer, winner);
    };

    return { player1, player2, playRound, resetGame };
})();

const ScreenController = (function () {
    const buttons = [];
    const container = document.querySelector(".container");
    const roundInfo = document.querySelector(".round-info");
    const winInfo = document.querySelector(".win-info");

    for (let i = 0; i < 3; i++) {
        buttons[i] = [];

        for (let j = 0; j < 3; j++) {
            buttons[i].push(document.querySelector(`.row${i}.column${j}`));
        }
    }

    const updateDisplay = (activePlayer, winner = "") => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!buttons[i][j].classList[2] && Gameboard.board[i][j] != 0) {
                    buttons[i][j].classList.add(Gameboard.board[i][j]);
                }
            }
        }

        if (winner == "") {
            roundInfo.textContent = `${activePlayer.name}'s turn (${activePlayer.symbol})`;
        } else if (winner == "tie") {
            winInfo.textContent = "It's a tie!";
        } else {
            winInfo.textContent = `${winner.name} (${winner.symbol}) wins!`;
        }
    };

    const refreshDisplay = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (buttons[i][j].classList[2]) {
                    buttons[i][j].classList.remove(
                        buttons[i][j].classList[
                            buttons[i][j].classList.length - 1
                        ]
                    );
                }
            }
        }
    };

    container.addEventListener("click", (event) => {
        if (
            event.target.tagName == "BUTTON" &&
            event.target.parentElement.classList.contains("table")
        ) {
            const row = event.target.classList[0].substring(
                event.target.classList[0].length - 1
            );
            const column = event.target.classList[1].substring(
                event.target.classList[1].length - 1
            );
            GameController.playRound(row, column);
        }

        if (event.target.textContent == "New Game") {
            GameController.resetGame();
            winInfo.textContent = "";
        }

        if (event.target.textContent == "Set Names") {
            if (
                document.querySelector("#player-one-name").value &&
                document.querySelector("#player-two-name").value
            ) {
                GameController.player1.setName(
                    document.querySelector("#player-one-name").value
                );
                GameController.player2.setName(
                    document.querySelector("#player-two-name").value
                );
                GameController.resetGame();
            }
        }
    });

    return { updateDisplay, refreshDisplay };
})();
