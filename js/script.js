let board = document.getElementById("board")
const pcs = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
let player = 'white';
let selectedPiece = '';
let hasPiece = false;
let check = false;
let suggestion = true;
let checkMoves = [];
let historyMoves = [];
let moveNumber = 0;

function setupBoard() {
    board.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let div = document.createElement('div');
            div.setAttribute('piece', '');
            div.classList.add('box');
            div.id = `box-${i}-${j}`;

            div.classList.add(((i + j) % 2 !== 0) ? 'light' : 'dark');

            if (i === 0 || i === 7) {
                div.setAttribute('piece', `${i === 0 ? 'black' : 'white'}-${pcs[j]}`);
                div.classList.add('placed');
            }
            if (i === 1 || i === 6) {
                div.setAttribute('piece', `${i === 1 ? 'black' : 'white'}-pawn`);
                div.classList.add('placed');
            }
            board.appendChild(div);
        }
    }
} setupBoard()

document.querySelectorAll('.box').forEach(box => {
    box.onclick = () => {
        if (box.classList.contains('selected')) {
            removeSelection();
            return
        }

        if (!selectedPiece) {
            if (check) findCheckMoves(box)
            if (box.getAttribute('piece').indexOf(player) >= 0) {
                selectPiece(box);
            }
        } else if (selectedPiece) {
            let a = selectedPiece.getAttribute('piece').split('-');
            let color = a[0];
            let type = a[1];

            if (box.getAttribute('piece').indexOf(color) >= 0) {
                removeSelection();
                selectPiece(box);
            } else if (box.classList.contains('legal')) {
                let move = {
                    pre: {
                        box: selectedPiece.id,
                        piece: selectedPiece.getAttribute('piece')
                    },
                    curr: {
                        box: box.id,
                        piece: box.getAttribute('piece')
                    }
                }
                if (moveNumber === historyMoves.length) {
                    historyMoves.push(move);
                } else {
                    historyMoves[moveNumber] = move
                }
                moveNumber++;
                localStorage.setItem('historyMoves', JSON.stringify(historyMoves))
                console.log(historyMoves, moveNumber)
                setPiece(box, color, type)
                switchPlayer();
                isCheck(box.id)
                delPiece();
                checkWinning()
                removeSuggestion();
            }
        }
    }
});

$('#undo').onclick = () => {
    if (moveNumber === 0) return
    moveNumber--;

    let move = historyMoves[moveNumber]
    let pre = move.pre;
    setPiece($('#' + pre.box), pre.piece.split('-')[0], pre.piece.split('-')[1])

    let current = move.curr;
    if (current.piece === '') {
        let box = $('#' + current.box);
        box.setAttribute('piece', '');
        box.classList.remove('placed')

    } else {
        setPiece($('#' + current.box), current.piece.split('-')[0], current.piece.split('-')[1]);
    }

    // removeSuggestion()
    switchPlayer()
    console.log(historyMoves, moveNumber)
    localStorage.setItem('historyMoves', JSON.stringify(historyMoves))
}

$('#redo').onclick = () => {
    if (moveNumber === historyMoves.length) return

    let move = historyMoves[moveNumber]

    let pre = move.pre;

    selectedPiece = $('#' + pre.box);
    let current = move.curr;

    setPiece($('#' + current.box), pre.piece.split('-')[0], pre.piece.split('-')[1])
    delPiece();
    switchPlayer()

    moveNumber++;
    console.log(historyMoves, moveNumber)
    localStorage.setItem('historyMoves', JSON.stringify(historyMoves))
}

function checkWinning() {
    if (!$('[piece=' + player + '-king]')) {
        setTimeout(() => {
            alert(`${player === 'white' ? 'black' : 'white'} has won`)
        }, 1000);
    }
}

function findCheckMoves(box) {
    let a = box.getAttribute('piece').split('-');
    let color = a[0];
    let type = a[1];

    let b = box.id.split('-');
    let i = parseInt(b[1]);
    let j = parseInt(b[2]);
}

function isCheck(id) {

    let moves = getMoves($('#' + id));
    // console.log($('#'+id).getAttribute('piece'))
    for (let move of moves) {
        let box = $('#box-' + move[0] + '-' + move[1]);
        // console.log(box)
        // let a = box.getAttribute('piece')==player + '-king'
        // console.log(a)

        if (box.getAttribute('piece') === player + '-king') {
            check = true
            box.classList.add('error')
            checkMoves = moves;
            // console.log(checkMoves)
            return
        }

        if (box.getAttribute('piece') === player + '-king') {

        }
    }
    check = false
}

function selectPiece(box) {
    box.classList.add('selected');
    selectedPiece = box;
    findLegalMoves(getMoves(selectedPiece));
}

function removeSelection() {
    selectedPiece.classList.remove('selected');
    selectedPiece = '';
    removeSuggestion();
}

function removeSuggestion() {
    document.querySelectorAll('.box').forEach(e => {
        e.classList.remove('legal');
        e.classList.remove('show')
    });
}

function setPiece(box, color, type) {
    box.setAttribute('piece', color + '-' + type);
    box.classList.add('placed');
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

function getMoves(box = selectedPiece) {
    let a = box.getAttribute('piece').split('-');
    // console.log(box.getAttribute('piece'))
    let color = a[0];
    let type = a[1];

    let b = box.id.split('-');
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
            moves = [
                [1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [1, 0], [-1, 0]
            ];
            nextMoves = getQueenMoves(i, j, color, moves)
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
    player = player === 'white' ? 'black' : 'white';
    // if (player === 'white') {
    //     player = 'black';
    // }
    // else {
    //     player = 'white'
    // }
    $('#currentPlayer').className = player;
}


function $(cs) {
    return document.querySelector(cs);
}
