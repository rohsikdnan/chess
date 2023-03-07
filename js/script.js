
const chessBoard = document.getElementById('board');
let selectedPiece = null;

const pcs = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
let src, dest;
let player = 'white'

const board = [
    ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
    ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
    ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
];

for (let i = 0; i < 8; i++) {
    const row = document.createElement('div');
    row.setAttribute('class', 'row');
    chessBoard.appendChild(row);

    for (let j = 0; j < 8; j++) {
        const square = document.createElement('div');
        square.setAttribute('class', 'square');

        if ((i + j) % 2 === 0) {
            square.style.backgroundColor = '#fff';
        } else {
            square.style.backgroundColor = '#999';
        }

        if (i === 0 || i === 7) {
            const piece = document.createElement('div');
            piece.setAttribute('class', `piece ${i === 0 ? 'black' : 'white'} ${pcs[j]}`);
            piece.setAttribute('type', `${pcs[j]}`);
            square.appendChild(piece);
        }

        if (i === 1 || i === 6) {
            const piece = document.createElement('div');
            piece.setAttribute('class', `piece ${i === 1 ? 'black' : 'white'} pawn`);
            piece.setAttribute('type', 'pawn');
            square.appendChild(piece);
        }

        row.appendChild(square);
    }
}


let squares = document.querySelectorAll('.square')

squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        let i = Math.floor(index / 8);
        let j = index % 8;

        const piece = square.querySelector(".piece");

        if (!piece && !selectedPiece) return;

        if (!selectedPiece) {
            if (piece.classList.contains(player)) {
                selectedPiece = piece;
                square.classList.add('selected')
                src = {
                    x: i,
                    y: j
                }
                console.log('src', src)
            }


        } else if (selectedPiece === piece) {
            square.classList.remove("selected");
            selectedPiece = null;
        }
        else {
            dest = {
                x: i,
                y: j
            }

            console.log('dest', dest)
            if (canMove() && isLegalMove()) {
                if (piece && piece.classList.contains(player)) return
              
                // console.log(selectedPiece)
                const fromSquare = selectedPiece.closest(".square");
                square.innerHTML = '';
                square.appendChild(selectedPiece);
                fromSquare.classList.remove("selected");
                selectedPiece = null;
                board[dest.x][dest.y] = board[src.x][src.y];
                board[src.x][src.y] = null;
                switchPlayer()
                clg(player)
                // clg(board)
            }
        }

    })
})

function checkMate() {
    let king = document.querySelector(`${player}.king`)
}

function switchPlayer() {
    let cPlayer = document.getElementById('currentPlayer')
    if (player === 'white') {
        player = 'black';
    }
    else {
        player = 'white'
    }
    cPlayer.className = player + " king"
}

function canMove() {
    let type = selectedPiece.getAttribute('type')
    let dir = player == 'white' ? 1 : -1

    if (selectedPiece.classList.contains(player)) {
        switch (type) {
            case 'rook':
                return (src.x === dest.x || src.y === dest.y);

            case 'knight':
                const dx = Math.abs(src.x - dest.x);
                const dy = Math.abs(src.y - dest.y);
                return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);

            case 'bishop':
                return Math.abs(src.x - dest.x) === Math.abs(src.y - dest.y);

            case 'queen':
                return (src.x === dest.x || src.y === dest.y) || Math.abs(src.x - dest.x) === Math.abs(src.y - dest.y);

            case 'king':
                return (Math.abs(src.x - dest.x) <= 1 && Math.abs(src.y - dest.y) <= 1);

            case 'pawn':
                let piece = squares[dest.x * 8 + dest.y].querySelector('.piece');

                if (((src.x - dest.x) === 1 * dir) && (Math.abs(src.y - dest.y) === 1) && piece && !piece.classList.contains(player)) return true

                if (src.y !== dest.y) return false;
                if (src.x === (player == 'white' ? 6 : 1) && src.x - dest.x === 2 * dir) return true;
                if ((src.x - dest.x === 1 * dir)) {
                    if (piece) return false;
                    return true;
                }
                return false;
        }
    }
}

function isLegalMove() {
    let type = selectedPiece.getAttribute('type')
    if (type == 'knight') return true
    if (src.x === dest.x) {
        for (let i = Math.min(src.y, dest.y) + 1; i < Math.max(src.y, dest.y); i++) {
            if (board[src.x][i] !== null) return false
        }
    }

    else if (src.y === dest.y) {
        for (let i = Math.min(src.x, dest.x) + 1; i < Math.max(src.x, dest.x); i++) {
            if (board[i][src.y] !== null) return false
        }
    }
    else {
        for (let i = Math.min(src.x, dest.x) + 1; i < Math.max(src.x, dest.x); i++) {
            if (board[i][src.y] !== null) return false
        }
    }

    return true;
}


// window.onresize = ()=>{
//     document.body.style.setProperty('--size',`calc(100% - 10vmin)`)
// }

function clg(s) {
    return console.log(s)
}