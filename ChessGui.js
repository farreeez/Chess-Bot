const { Rook, Pawn, Bishop, King, Queen, Knight, getPieceImage } = require('./pieces.js')
let jimp = require('jimp');

// checks if the notation imputed is valid chess notation.
function checkIfChessNotiationValid(chessMove) {
    chessMove = chessMove.toLowerCase();
    chessMove = chessMove.replace('x', '');
    chessMove = chessMove.replace('+', '');
    chessMove = chessMove.replace('#', '');
    chessMove = chessMove.replaceAll(' ', '');
    let arrayOfPieces = ['k', 'n', 'b', 'r', 'q'];
    let arrayOfRows = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let arrayOfColumns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    if (chessMove.length == 2) {
        if (arrayOfColumns.includes(chessMove[0]) && arrayOfRows.includes(chessMove[1])) {
            return true;
        }
    } else if (chessMove.length == 3) {
        if ((arrayOfPieces.includes(chessMove[0]) && arrayOfColumns.includes(chessMove[1]) && arrayOfRows.includes(chessMove[2])) || (arrayOfColumns.includes(chessMove[0]) && arrayOfColumns.includes(chessMove[1]) && arrayOfRows.includes(chessMove[2]))) {
            return true;
        }
    } else if (chessMove.length == 4) {
        if (arrayOfPieces.includes(chessMove[0]) && (arrayOfColumns.includes(chessMove[1]) || arrayOfRows.includes(chessMove[1])) && arrayOfColumns.includes(chessMove[2]) && arrayOfRows.includes(chessMove[3])) {
            return true;
        }
    } else if (chessMove.length == 5) {
        if (arrayOfPieces.includes(chessMove[0]) && arrayOfColumns.includes(chessMove[1]) && arrayOfRows.includes(chessMove[2]) && arrayOfColumns.includes(chessMove[3]) && arrayOfRows.includes(chessMove[4])) {
            return true;
        }
    }
    return false;
}

// code to create a composite image with the board background and the chess pieces layered on top of it depending on their position
async function chessBoardImg(chessBoard) {
    let images = ['./emptyChessBoard.png'];
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[1].length; j++) {
            if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1) {
                images.push(getPieceImage(chessBoard[i][j]));
            }
        }
    }
    let jimps = [];

    for (let i = 0; i < images.length; i++) {
        jimps.push(jimp.read(images[i]));
    }

    await Promise.all(jimps).then(function (data) {
        return Promise.all(jimps);
    }).then(function (data) {
        let posOfPic = 1;
        for (let i = 0; i < chessBoard.length; i++) {
            for (let j = 0; j < chessBoard[i].length; j++) {
                if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1) {
                    data[0].composite(data[posOfPic], (j * 100 + 10), (i * 100 + 10));
                    posOfPic++;
                }
            }
        }
        data[0].write('finalBoardImgs/finalBoard.png')
    })
}

module.exports = { checkIfChessNotiationValid, chessBoardImg };