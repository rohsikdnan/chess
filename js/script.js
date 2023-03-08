let board = document.getElementById("board")
const pcs = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
let player = 'white';
let selectedPiece = '';
let hasPiece = false;
let check = false;
let suggestion = true;

function setupBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let div = document.createElement('div');
            div.setAttribute('piece', '');
            div.classList.add('box');
            div.id = 'box' + '-' + i + '-' + j;

            div.classList.add(((i + j) % 2 !== 0) ? 'light' : 'dark');

            if (i == 0 || i == 7) {
                div.setAttribute('piece', `${i == 0 ? 'black' : 'white'}-${pcs[j]}`);
                div.classList.add('placed');
            }
            if (i == 1 || i == 6) {
                div.setAttribute('piece', `${i == 1 ? 'black' : 'white'}-pawn`);
                div.classList.add('placed');
            }
            board.appendChild(div);
        }
    }
} setupBoard()

document.querySelectorAll('.box').forEach(box => {
    box.onclick = () => {
        if (box.classList.contains('selected')) {
            box.classList.remove('selected');
            selectedPiece = '';
            document.querySelectorAll('.box').forEach(e => { e.classList.remove('legal'); e.classList.remove('show') });
            // hasPiece = false
            return
        }
        if (!selectedPiece) {
            if (box.getAttribute('piece').indexOf(player) >= 0) {
                selectPiece(box);
            }
        } else if (selectedPiece) {
            let a = selectedPiece.getAttribute('piece').split('-');
            let color = a[0];
            let type = a[1];

            if (box.getAttribute('piece').indexOf(color) >= 0) {
                selectedPiece.classList.remove('selected');
                document.querySelectorAll('.box').forEach(e => { e.classList.remove('legal'); e.classList.remove('show') });
                selectPiece(box);
            } else if (box.classList.contains('legal')) {

                box.setAttribute('piece', color + '-' + type);
                box.classList.add('placed');
                delPiece();

                switchPlayer();
                checkWinning()
                document.querySelectorAll('.box').forEach(e => { e.classList.remove('legal'); e.classList.remove('show') });
            }
        }
    }
})

function checkWinning() {
    if (!$('[piece=' + player + '-king]')) {
        setTimeout(() => {
            alert(player === 'white' ? 'black' : 'white' + ' has won')
        }, 1000);
    }
}

function selectPiece(box) {
    box.classList.add('selected');
    selectedPiece = box;
    findLegalMoves(getMoves());
}

function delPiece() {
    selectedPiece.setAttribute('piece', '');
    selectedPiece.classList.remove('placed');
    selectedPiece.classList.remove('selected');
    selectedPiece = '';
}

function findLegalMoves(nextMoves) {
    for (var move of nextMoves) {
        var box = $('#box-' + move[0] + '-' + move[1]);
        box.classList.add('legal');
        if (suggestion) box.classList.add('show')
    }
}

function getMoves() {
    let a = selectedPiece.getAttribute('piece').split('-');
    let color = a[0];
    let type = a[1];

    let b = selectedPiece.id.split('-');
    let i = parseInt(b[1]);
    let j = parseInt(b[2]);

    let nextMoves = [];
    let moves;
    switch (type) {
        case 'pawn':
            if (color === 'black') {
                moves = [
                    [1, 0], [2, 0], [1, -1], [1, 1]
                ];
            } else {
                moves = [
                    [-1, 0], [-2, 0], [-1, 1], [-1, -1]
                ];
            }
            nextMoves = getPawnMoves(i, j, color, moves);
            break;
        case 'rook':
            moves = [
                [0, 1], [0, -1], [1, 0], [-1, 0]

            ];
            nextMoves = getQueenMoves(i, j, color, moves);
            break;
        case 'knight':
            moves = [
                [-1, -2], [-2, -1], [1, -2], [-2, 1],
                [2, -1], [-1, 2], [2, 1], [1, 2]
            ];
            nextMoves = getKnightMoves(i, j, color, moves);
            break;
        case 'bishop':
            moves = [
                [1, 1], [1, -1], [-1, 1], [-1, -1]
            ];
            nextMoves = getQueenMoves(i, j, color, moves);
            break;
        case 'queen':
            var moves1 = [
                [1, 1], [1, -1], [-1, 1], [-1, -1]
            ];
            var moves2 = [
                [0, 1], [0, -1], [1, 0], [-1, 0]
            ];
            nextMoves = getQueenMoves(i, j, color, moves1)
                .concat(getQueenMoves(i, j, color, moves2));
            break;
        case 'king':
            moves = [
                [1, 1], [1, -1], [-1, 1], [-1, -1],
                [0, 1], [0, -1], [1, 0], [-1, 0]
            ];
            nextMoves = getKnightMoves(i, j, color, moves);
            break;
        default:
            break;
    }

    return nextMoves;
}


function getPawnMoves(i, j, color, moves) {
    var nextMoves = [];
    for (var index = 0; index < moves.length; index++) {
        var I = i + moves[index][0];
        var J = j + moves[index][1];
        if (!outOfBounds(I, J)) {
            var box = $('#box-' + I + '-' + J);

            if (index === 0) {
                if (!box.classList.contains('placed')) {
                    nextMoves.push([I, J]);
                } else {
                    index++;
                }
            } else if (index === 1) {
                if (((color === 'black' && i === 1) || (color === 'white' && i === 6)) && !box.classList.contains('placed')) {
                    nextMoves.push([I, J]);
                }
            } else if (index > 1) {
                if (box.getAttribute('piece') !== '' && box.getAttribute('piece').indexOf(color) < 0) {
                    nextMoves.push([I, J]);
                }
            }
        }
    }
    return nextMoves;
}


function getQueenMoves(i, j, color, moves) {
    var nextMoves = [];
    for (var move of moves) {
        var I = i + move[0];
        var J = j + move[1];
        var sugg = true;
        while (sugg && !outOfBounds(I, J)) {
            var box = $('#box-' + I + '-' + J);
            if (box.classList.contains('placed')) {
                if (box.getAttribute('piece').indexOf(color) >= 0) {
                    sugg = false;
                } else {
                    nextMoves.push([I, J]);
                    sugg = false;
                }
            }
            if (sugg) {
                nextMoves.push([I, J]);
                I += move[0];
                J += move[1];
            }
        }
    }
    return nextMoves;
}

function getKnightMoves(i, j, color, moves) {
    var nextMoves = [];
    for (var move of moves) {
        var I = i + move[0];
        var J = j + move[1];
        if (!outOfBounds(I, J)) {
            var box = $('#box-' + I + '-' + J);
            if (!box.classList.contains('placed') || box.getAttribute('piece').indexOf(color) < 0) {
                nextMoves.push([I, J]);
            }
        }
    }
    return nextMoves;
}

function outOfBounds(i, j) {
    return (i < 0 || i >= 8 || j < 0 || j >= 8);
}


$('#suggest').onchange = () => {
    suggestion = suggestion ? false : true
    document.querySelectorAll('.legal').forEach(e => {
        suggestion ? e.classList.add('show') : e.classList.remove('show')
    });
}

function switchPlayer() {
    let cPlayer = document.getElementById('currentPlayer');
    player = player === 'white' ? 'black' : 'white';
    // if (player === 'white') {
    //     player = 'black';
    // }
    // else {
    //     player = 'white'
    // }
    cPlayer.className = player;
}


function $(cs) {
    return document.querySelector(cs);
}