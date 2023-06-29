const { Queen, Bishop, Knight, Pawn, King, Rook, getAllAttackedPositions } = require('./pieces.js');

// finds the king of the given colour and returns the instance of that king.
function findKing(chessBoard, colour) {
    let king;
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] != 1 && chessBoard[i][j] != 0) {
                if (chessBoard[i][j].colour == colour && chessBoard[i][j].getPieceType() == 'King') {
                    king = chessBoard[i][j];
                }
            }
        }
    }
    return king;
}

// if there are no more possible moves for the given colour and the that side has not been checkmated then it returns true.
function stalemate(chessBoard, colour) {
    if (getAllAttackedPositions(chessBoard, colour).length == 0 && !checkMate(chessBoard, enemyColour)) {
        return true;
    }
    return false;
}

function checkIfKingIsSafe(chessBoard, colour) {
    let numOfAttackers = 0;
    let king = findKing(chessBoard, colour);
    let arrayOfAttacks = getAllAttackedPositions(chessBoard, 2);
    // finds if the king is being attacked and returns the number of times it is getting attacked
    for (let i = 0; i < arrayOfAttacks.length; i++) {
        if (arrayOfAttacks[i][0] == king.row && arrayOfAttacks[i][1] == king.column) {
            numOfAttackers++;
        }
    }
    return numOfAttackers;
}

function findIfAttackedBy(chessBoard, attacking, row, column) {
    // if the piece is not attacking any squares then return false
    let arrayOfAttacks = attacking.getAttackedPositions(chessBoard);
    if (arrayOfAttacks.length == 0) {
        return false;
    }
    // if the piece's row and column are in the list of positions attacked then return true.
    for (let i = 0; i < arrayOfAttacks.length; i++) {
        if (arrayOfAttacks[i][0] == row && arrayOfAttacks[i][1] == column) {
            return true;
        }
    }
    return false;
}

// attacks the position passed into the function (variable attacked representing the position that is attacked) using one of the pieces in the arrayOfAttackers
// and if the king becomes in danger afterwards that piece is removed from the array of attackers and then the move is undone regardless of wether the king is threatend or not.
function checkIfMoveIsDanger(attacked, chessBoard, arrayOfAttackers, colour) {
    for (let i = 0; i < arrayOfAttackers.length; i++) {
        // simulating the move
        let stored = chessBoard[attacked.row][attacked.column];
        chessBoard[attacked.row][attacked.column] = chessBoard[arrayOfAttackers[i].row][arrayOfAttackers[i].column];
        chessBoard[arrayOfAttackers[i].row][arrayOfAttackers[i].column] = 0;
        chessBoard[attacked.row][attacked.column].row = arrayOfAttackers[i].row;
        chessBoard[attacked.row][attacked.column].column = arrayOfAttackers[i].column;
        // checking if the king is in danger and removes the attacker from the array if so.
        let king = findKing(chessBoard, colour);
        let attackedPositions = getAllAttackedPositions(chessBoard, 2);
        for (let k = 0; k < attackedPositions.length; k++) {
            if (attackedPositions[k][0] == king.row && attackedPositions[k][1] == king.column) {
                let deletePos = arrayOfAttackers.indexOf(i);
                arrayOfAttackers.splice(deletePos, 1);
            }
        }
        // undoes the simulated move.
        chessBoard[arrayOfAttackers[i].row][arrayOfAttackers[i].column].row = attacked.row;
        chessBoard[arrayOfAttackers[i].row][arrayOfAttackers[i].column].column = attacked.column;
        chessBoard[arrayOfAttackers[i].row][arrayOfAttackers[i].column] = chessBoard[attacked.row][attacked.column];
        chessBoard[attacked.row][attacked.column] = stored;
    }
}

// checks if the rook is checking the opposite colour king
function checkIfRookCheck(row, column, rookRow, rookColumn, chessBoard, king) {
    // variables row and column are the coordinates of squares that are right next to the king and can be attacked by rooks ie the square above,below,to the right or left of the king
    let arrayOfPositionsCovered = [];
    // if Rook is touching the king
    if (row == rookRow && column == rookColumn) {
        // the true value shows whether the rook is touching the king or not
        return [true, [row, column]];
    } else if (row >= 0 && row <= 7 && column >= 0 && column <= 7) {
        // if the rook is attacking the square at [row][column] but is not touching the king
        if (findIfAttackedBy(chessBoard, chessBoard[rookRow][rookColumn], row, column)) {
            // if the square attacked by the rook is above the king
            if (row == king.row - 1 && column == king.column) {
                // adds all the squares between the king and the rook into the attacked squares array this is the same for all the other while loops
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    row--;
                }
                arrayOfPositionsCovered.push([row, column]);
                // if the square attacked by the rook is below the king
            } else if (row == king.row + 1 && column == king.column) {
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    row++;
                }
                arrayOfPositionsCovered.push([row, column]);
                // if the square attacked by the rook is to the left of the king
            } else if (row == king.row && column == king.column - 1) {
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    column--;
                }
                arrayOfPositionsCovered.push([row, column]);
                // if the square attacked by the rook is to the right of the king
            } else if (row == king.row && column == king.column + 1) {
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    column++;
                }
                arrayOfPositionsCovered.push([row, column]);
            }
            // the first variable is false because the rook is not touching the king
            return [false, arrayOfPositionsCovered];
        }
    }
    return 0;
}

function checkIfBishopCheck(row, column, bishopRow, bishopColumn, chessBoard, king) {
    // variables row and column are the coordinates of squares that are on the corners touching the king and can be attacked by a bishop
    let arrayOfPositionsCovered = [];
    // if the bishop is at one of the squares that are at the corners and are touching the opposite coloured king then the first variable is true and the row and col are returned
    if (row == bishopRow && column == bishopColumn) {
        return [true, [row, column]];
    } else if (row >= 0 && row <= 7 && column >= 0 && column <= 7) {
        if (findIfAttackedBy(chessBoard, chessBoard[bishopRow][bishopColumn], row, column)) {
            // if the square attacked by the bishop is the top right corner of the king 
            if (row == king.row - 1 && column == king.column + 1) {
                // this while loop adds all the squares between the bishop and the king that are on the same diagonal and all the other while loops do the same function but for different
                // corners/diagonals
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    row--;
                    column++;
                }
                arrayOfPositionsCovered.push([row, column]);
                // if the square attacked by the bishop is the top left corner of the king 
            } else if (row == king.row - 1 && column == king.column - 1) {
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    row--;
                    column--;
                }
                arrayOfPositionsCovered.push([row, column]);
                // if the square attacked by the bishop is the bottom left corner of the king 
            } else if (row == king.row + 1 && column == king.column - 1) {
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    row++;
                    column--;
                }
                arrayOfPositionsCovered.push([row, column]);
                // if the square attacked by the bishop is the bottom right corner of the king 
            } else if (row == king.row + 1 && column == king.column + 1) {
                while (row >= 0 && row <= 7 && column >= 0 && column <= 7 && chessBoard[row][column] == 0) {
                    arrayOfPositionsCovered.push([row, column]);
                    row++;
                    column++;
                }
                arrayOfPositionsCovered.push([row, column]);
            }
            // the first variable is false if the bishop is not touching the king
            return [false, arrayOfPositionsCovered];
        }
    }
    return [];
}

// cycles through the board and checks if the given piece is attacked by any other pieces and if so then it is added to the array of attackers and the array of attackers is returned
function findAttackers(piece, chessBoard) {
    let arrayOfAttackers = [];
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1) {
                for (let k = 0; k < chessBoard[i][j].getAttackedPositions(chessBoard).length; k++) {
                    if (chessBoard[i][j].getAttackedPositions(chessBoard)[k][0] == piece.row && chessBoard[i][j].getAttackedPositions(chessBoard)[k][1] == piece.column) {
                        arrayOfAttackers.push(chessBoard[i][j]);
                    }
                }
            }
        }
    }
    return arrayOfAttackers;
}

function coverCheckHelperFunction(array, chessBoard, colour) {
    if (array.length == 0) {
        return [];
    }
    // if the first variable is true meaning that the bishop/rook/queen attaking the king is touching the king then find attackers that can take that bishop/rook/queen
    // and use checkIfMoveIsDanger function to remove the attackers that would cause a check on your king if they took the bishop/rook/queen touching your king
    // and return the arrayOfAtttackers alongside the position of the piece they are attacking 
    if (array[0]) {
        if (findAttackers(array[1], chessBoard).length > 0) {
            let arrayOfAttackers = findAttackers(chessBoard[i][j], chessBoard);
            checkIfMoveIsDanger(array[1], chessBoard, arrayOfAttackers, colour);
            return [arrayOfAttackers, array[1]];
        }
        // if the first variable is false meaning that the bishop/rook/queen attacking the king is not touching the king.
    } else if (!array[0]) {
        // the 0 is to help distinguish if the array is for covering a piece that is touching the king or not
        let arrays = [0];
        // cycle through the array of positions covered between the bishop/rook/queen attacking the king and find all the pieces that can cover one of those positions
        // to block the attack and use checkIfMoveIsDanger function to remove the attackers that would cause a check on your king if they took the bishop/rook/queen touching your king
        // and return an array of arrays containing the arrayOfAtttackers alongside the corresponding position of the square they are capable of covering. 
        for (let k = 0; k < array[1].length; k++) {
            if (findAttackers(array[1][k], chessBoard).length > 0) {
                let arrayOfAttackers = findAttackers(array[1][k], chessBoard);
                checkIfMoveIsDanger(array[1][k], chessBoard, arrayOfAttackers, colour);
                arrays.push([arrayOfAttackers, array[1][k]]);
            }
        }
        return arrays;
    }
    return []
}

function bishopCoverCheck(king, row, column, chessBoard, colour) {
    let a = king.row - 1;
    let b = king.column + 1;
    let touch = [];
    // checking if the bishop is attacking the top right corner of the king
    let possibleTouch = checkIfBishopCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    // checking if the bishop is attacking the top left corner of the king
    b = king.column - 1;
    possibleTouch = checkIfBishopCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    // checking if the bishop is attacking the bottom left corner of the king
    a = king.row + 1;
    possibleTouch = checkIfBishopCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    // checking if the bishop is attacking the bottom right corner of the king
    b = king.column - 1;
    possibleTouch = checkIfBishopCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    return coverCheckHelperFunction(touch, chessBoard, colour);
}

function rookCoverCheck(king, row, column, chessBoard, colour) {
    let a = king.row - 1;
    let b = king.column;
    let touch = [];
    // checking if the rook is attacking the square above the king
    let possibleTouch = checkIfRookCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    a = king.row + 1;
    // checking if the rook is attacking the square below the king
    possibleTouch = checkIfRookCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    a = king.row
    b = king.column + 1;
    // checking if the rook is attacking the square to the right of the king
    possibleTouch = checkIfRookCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    b = king.column - 1;
    // checking if the rook is attacking the square to the left of the king
    possibleTouch = checkIfRookCheck(a, b, row, column, chessBoard, king);
    if (possibleTouch != 0) {
        touch = possibleTouch;
    }
    return coverCheckHelperFunction(touch, chessBoard, colour);
}

function coverCheck(chessBoard, colour) {
    let king = findKing(chessBoard, colour);
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] !== 0 && chessBoard[i][j] !== 1 && chessBoard[i][j].colour != colour) {
                // find the piece that is attacking the king
                if (findIfAttackedBy(chessBoard, chessBoard[i][j], king.row, king.column)) {
                    if (chessBoard[i][j].getPieceType() == 'Bishop') {
                        return bishopCoverCheck(king, i, j, chessBoard, colour)
                    } else if (chessBoard[i][j].getPieceType() == 'Rook') {
                        return rookCoverCheck(king, i, j, chessBoard, colour)
                        // uses the bishopCoverCheck and the rookCoverCheck functions because the queen can either attack as a bishop or rook and chooses whichever one it is attacking like.
                    } else if (chessBoard[i][j].getPieceType() == 'Queen') {
                        let queenArray = rookCoverCheck(king, i, j, chessBoard, colour);
                        if (queenArray.length == 0) {
                            queenArray = bishopCoverCheck(king, i, j, chessBoard, colour);
                        }
                        return queenArray;
                        // in the case of either the pawn or knight the only viable case is another piece taking the pawn/knight
                    } else if (chessBoard[i][j].getPieceType() == 'Knight') {
                        return [checkIfMoveIsDanger(chessBoard[i][j], chessBoard, findAttackers(chessBoard[i][j], chessBoard), colour), [i, j]];
                    } else if (chessBoard[i][j].getPieceType() == 'Pawn') {
                        return [checkIfMoveIsDanger(chessBoard[i][j], chessBoard, findAttackers(chessBoard[i][j], chessBoard), colour), [i, j]];
                    }
                }
            }
        }
    }
    return [];
}

// deletes enpassant within the board
function deleteEnPassant(chessBoard) {
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1 && chessBoard[i][j].getPieceType() == 'Pawn') {
                chessBoard[i][j].Passant = 0;
            }
            if (chessBoard[i][j] == 1) {
                chessBoard[i][j] = 0;
            }
        }
    }
}

function getSpecificAttacks(piece, chessBoard, emptyOrNot) {
    // gets the positions that the piece sees/can move to.
    let coveredSpaces = piece.getAttackedPositions(chessBoard);
    // if the emptyOrNot is 1 removes the non empty positions that the piece sees else if it is 0 the empty positions that the piece sees are removed from the array.
    while (coveredSpaces.length > 0 && (new Set(coveredSpaces)).size !== 1) {
        for (let i = 0; i < coveredSpaces.length; i++) {
            if (emptyOrNot == 1) {
                if (chessBoard[coveredSpaces[i][0]][coveredSpaces[i][1]] != 0 && chessBoard[coveredSpaces[i][0]][coveredSpaces[i][1]] != 1) {
                    coveredSpaces.splice(i, 1);
                    break;
                }
            } else if (emptyOrNot == 0) {
                if (chessBoard[coveredSpaces[i][0]][coveredSpaces[i][1]] == 0 || chessBoard[coveredSpaces[i][0]][coveredSpaces[i][1]] == 1) {
                    coveredSpaces.splice(i, 1);
                    break;
                }
            }
        }
        break;
    }
    return coveredSpaces;
}

// checks if an array of arrays of length 2 contains a specific array of length 2
function includesArray(bigArray, smallArray) {
    for (let i = 0; i < bigArray.length; i++) {
        if (bigArray[i][0] == smallArray[0] && bigArray[i][1] == smallArray[1]) {
            return true;
        }
    }
    return false;
}

function castling(chessMove, chessBoard, colour) {
    chessMove = chessMove.toLowerCase();
    let side
    // side = 3 means short castle side = 5 means long castle.
    if (chessMove == "0-0" || chessMove == "o-o") {
        side = 3;
    } else if (chessMove == "0-0-0" || chessMove == "o-o-o") {
        side = 5;
    } else {
        return;
    }

    // if the colour is black (colour == 1) then row 0 is where the castling occurs else it is row 7
    let row = 7;
    // the first variable in the column array refers to the position of the rook that is castling
    let column = [0, 2];
    let sign = -1;

    if (colour == 1) {
        row = 0;
    }

    if (side == 3) {
        column = [7, 6];
    }

    // checks if the king and rook are in the correct position and if they havent moved.
    if (chessBoard[row][column[0]] == 0 || chessBoard[row][4] == 0) {
        return;
    } else if (!((chessBoard[row][column[0]].getPieceType() == "Rook" && chessBoard[row][4].getPieceType() == "King") && (chessBoard[row][column[0]].getCastle() + chessBoard[row][4].getCastle() == 2))) {
        return;
    }

    if (column[0] == 7) {
        sign = 1;
    }

    let allAttackedPositions = getAllAttackedPositions(chessBoard, (colour * -1) + 1);

    // checks if the positions betweent he king and rook are empty.
    if (side == 3) {
        if (!(chessBoard[row][5] == 0 && chessBoard[row][6] == 0)) {
            return;
        }
    } else {
        if (!(chessBoard[row][1] == 0 && chessBoard[row][2] == 0 && chessBoard[row][3] == 0)) {
            return;
        }
    }

    // checks if the positions between the rook and the king are under attack and returns if so
    for (let j = 1; j < sign * (column[0] - 4); j++) {
        if (sign == -1) {
            if (j == 1) {
                j++;
            }
            if (includesArray(allAttackedPositions, [row, j])) {
                return;
            }
        } else {
            let col = 4 + j;
            if (includesArray(allAttackedPositions, [row, col])) {
                return;
            }
        }
    }

    // castles
    chessBoard[row][column[1]] = chessBoard[row][4];
    chessBoard[row][column[1] + sign * -1] = chessBoard[row][column[0]];
    chessBoard[row][4] = 0;
    chessBoard[row][column[0]] = 0;
    chessBoard[row][column[1]].column = column[1];
    chessBoard[row][column[1] + sign * -1].column = column[1] + sign * -1;
}

function checkIfPieceCanMove(piece, chessBoard, row, column, emptyOrNot) {
    if (row >= 0 && row <= 7 && column >= 0 && column <= 7) {
        if (piece.getPieceType() == "Pawn" && emptyOrNot == 1) {
            let sign = -1;
            let startingRow = 6;
            if (piece.colour == 1) {
                sign = 1;
                startingRow = 1
            }
            // if the pawn is moving into an empty spot check if the spot is empty and if the pawn is able to move there and return true if it is
            if (piece.row == startingRow) {
                if (piece.row + sign * 2 == row && piece.column == column && chessBoard[row][column] == 0 && chessBoard[row - sign][column] == 0) {
                    // if the pawn is moving into an empty space and it is moving 2 squares up on its first move then allow en passant on the next turn
                    piece.enPassant(chessBoard);
                    return true;
                } else if (piece.row + sign * 1 == row && piece.column == column && chessBoard[row][column] == 0) {
                    return true;
                }
            } else {
                if (piece.row + sign * 1 == row && piece.column == column && chessBoard[row][column] == 0) {
                    return true;
                }
            }
        } else {
            // otherwise use the getSpecificAttacks function to get the possible squares that the piece can move into and if the square that the player wants to move to is one of
            // of those squares return true.
            let arrayOfAttacks = getSpecificAttacks(piece, chessBoard, emptyOrNot);
            for (let i = 0; i < arrayOfAttacks.length; i++) {
                if (arrayOfAttacks[i][0] == row && arrayOfAttacks[i][1] == column) {
                    if (chessBoard[row][column] != 1) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// converts the column chess notation inputed by the user to array index positions
function letterNotationToNum(letter) {
    letter = letter.toLowerCase();
    letter = letter.codePointAt(0);
    if (letter >= 97 && letter <= 104) {
        return letter - 97;
    } else {
        return "error: invalid letter";
    }
}

// converts the chess notation inputed by the user to piece type strings
function letterToPiece(letter) {
    letter = letter.toLowerCase();
    let arrayOfPieces = ["q", "Queen", "n", "Knight", "k", "King", "r", "Rook", "b", "Bishop"];
    return arrayOfPieces[arrayOfPieces.indexOf(letter) + 1];
}

// converts the row string given by the user into array index positions
function getRow(row) {
    row = parseInt(row);
    let rowNum = 7;
    for (let i = 1; i < 9; i++) {
        if (i == row) {
            return rowNum;
        }
        rowNum--;
    }
}

function makeMove(chessMove, chessBoard, colour) {
    chessMove = chessMove.toLowerCase();
    // if the notation includes x the emptyOrNot = 0 meaning that this move needs to take a piece
    let emptyOrNot = 1;
    if (chessMove.includes('x')) {
        emptyOrNot = 0;
    }
    chessMove = chessMove.replace('x', '');
    chessMove = chessMove.replace('+', '');
    chessMove = chessMove.replace('#', '');
    chessMove = chessMove.replaceAll(' ', '');
    let count = 0;
    let row;
    let column;
    let pieceType;
    let valid = 1;
    let rowOfMoving;
    let columnOfMoving;
    let arrayOfPieces = ['k', 'n', 'b', 'r', 'q'];
    let arrayOfRows = ['1', '2', '3', '4', '5', '6', '7', '8'];
    let arrayOfColumns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    let attacking = -1;
    // pawn moves
    if (chessMove.length == 2 || (chessMove.length == 3 && !arrayOfPieces.includes(chessMove[0]))) {
        // intiating the row, column and the column of the attacking piece if there are 2 pawns attacking
        if (chessMove.length == 2) {
            row = getRow(chessMove[1]);
            column = letterNotationToNum(chessMove[0]);
        } else if (chessMove.length == 3) {
            attacking = letterNotationToNum(chessMove[0]);
            row = getRow(chessMove[2]);
            column = letterNotationToNum(chessMove[1]);
        }
        // cycles through the board and if the piece is a pawn and is of the same colour as the one inputed in the function 
        // then check if the piece can move to that position using checkIfPieceCanMove function and if so add one to the count of pieces that can move there
        for (let i = 0; i < chessBoard.length; i++) {
            for (let j = 0; j < chessBoard[i].length; j++) {
                if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1) {
                    if (chessBoard[i][j].getPieceType() == "Pawn" && chessBoard[i][j].colour == colour) {
                        if (checkIfPieceCanMove(chessBoard[i][j], chessBoard, row, column, emptyOrNot)) {
                            rowOfMoving = i;
                            columnOfMoving = j;
                            count++;
                        }
                    }
                }
            }
        }
        // if 2 pawns can move and the notation inputed does not say which pawn should move then return because the notation is invalid in this
        if (chessMove.length == 2 && count != 1) {
            return;
        }
        i = rowOfMoving;
        j = columnOfMoving;
        if (chessMove.length == 3 && count == 1) {
            j = attacking;
        }

        if (count == 0) {
            return;
        }
        // if the king has one attacker
        if (checkIfKingIsSafe(chessBoard, colour) == 1) {
            waysToCoverCheck = coverCheck(chessBoard, colour)
            // one attacker case where the attacker is touching
            if (waysToCoverCheck[0] != 0 && waysToCoverCheck[0].length > 0) {
                // if the piece is not taking the attacker then return
                if (!(row == waysToCoverCheck[1][0] && column == waysToCoverCheck[1][1])) {
                    return;
                }
                // if the attacker is not touching the king
            } else if (waysToCoverCheck[0] == 0) {
                valid = 0;
                // cycle through the array of arrays
                for (let k = 1; k < waysToCoverCheck.length; k++) {
                    // check if the current piece that is moving is included in the array of attackers
                    if (waysToCoverCheck[k][0].includes(chessBoard[i][j])) {
                        // check if that piece is moving to the position that is attacked by that list of attackers.
                        if (waysToCoverCheck[k][1][0] == i && waysToCoverCheck[k][1][1] == j) {
                            valid = 2;
                        }
                    }
                }
            }
            // if the king has 2 attackers it is impossible for the pawn to block therefore the move is invalid
        } else if (checkIfKingIsSafe(chessBoard, colour) == 2) {
            return;
        }
        if (valid == 0) {
            return;
        }
        let enPassantExists = 0;
        let storeEnPassant;
        // if the pawn is preforming an en passant then store the piece being taken just in case the move needs to be undone due to it being ilegal
        if (chessBoard[row][column] == 1) {
            enPassantExists = 1;
            if (colour == 0) {
                storeEnPassant = chessBoard[row + 1][column];
                chessBoard[row + 1][column] = 0;
            } else if (colour == 1) {
                storeEnPassant = chessBoard[row - 1][column];
                chessBoard[row - 1][column] = 0;
            }
        }
        // makes the move and if the king becomes under attack the move is undone
        let stored = chessBoard[row][column];
        chessBoard[row][column] = chessBoard[i][j];
        chessBoard[i][j] = 0;
        chessBoard[row][column].row = row;
        chessBoard[row][column].column = column;
        let king = findKing(chessBoard, colour);
        let attackedPositions = getAllAttackedPositions(chessBoard, 2);
        for (let k = 0; k < attackedPositions.length; k++) {
            if (attackedPositions[k][0] == king.row && attackedPositions[k][1] == king.column) {
                chessBoard[row][column].row = i;
                chessBoard[row][column].column = j;
                chessBoard[i][j] = chessBoard[row][column];
                chessBoard[row][column] = stored;
                // undoes enpassant if king becomes under attack
                if (enPassantExists == 1) {
                    chessBoard[row][column] = 1;
                    if (colour == 0) {
                        chessBoard[row + 1][column] = storeEnPassant;
                    } else if (colour == 1) {
                        chessBoard[row - 1][column] = storeEnPassant;
                    }
                } else {
                    chessBoard[row][column] = 0;
                }
                return false;
            }
        }
        // removes enpassants unless the pawn that had just moved moved by 2 squares
        if (chessBoard[row][column].getPassant() == 1) {
            if (colour == 0) {
                if (chessBoard[row][column].row == 4) {
                    return;
                }
            } else if (colour == 1) {
                if (chessBoard[row][column].row == 3) {
                    return;
                }
            }
        }
        deleteEnPassant(chessBoard);
        return;
        // if the chess notation indicates that non pawns are moving and there is no need to indicate the position it is moving from.
    } else if (chessMove.length == 3 && arrayOfPieces.includes(chessMove[0])) {
        row = getRow(chessMove[2]);
        column = letterNotationToNum(chessMove[1]);
        pieceType = letterToPiece(chessMove[0]);
        for (let i = 0; i < chessBoard.length; i++) {
            for (let j = 0; j < chessBoard[i].length; j++) {
                if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1) {
                    if (chessBoard[i][j].getPieceType() == pieceType && chessBoard[i][j].colour == colour) {
                        if (checkIfPieceCanMove(chessBoard[i][j], chessBoard, row, column, emptyOrNot)) {
                            rowOfMoving = i;
                            columnOfMoving = j;
                            count++;
                        }
                    }
                }
            }
        }
        if (count != 1) {
            return;
        }
        // moves the piece unless the king becomes under attack
        makeMoveHelperFunction(rowOfMoving, columnOfMoving, row, column, chessBoard, colour);
        // if the chess notation indicates that non pawns are moving and there is only a need to indicate either the column or row of the piece moving but not both.
    } else if (chessMove.length == 4) {
        // colOrRow indicates whether the info given about the piece moving shows its column or row 0 being row 1 being column
        let colOrRow = 0;
        let piece;
        if (arrayOfRows.includes(chessMove[1])) {
            attacking = getRow(chessMove[1]);
        } else if (arrayOfColumns.includes(chessMove[1])) {
            attacking = letterNotationToNum(chessMove[1]);
            colOrRow = 1;
        }
        row = getRow(chessMove[3]);
        column = letterNotationToNum(chessMove[2]);
        pieceType = letterToPiece(chessMove[0]);
        // if the column is given find the row that the piece that is moving is on and make the move
        if (colOrRow == 1) {
            for (let i = 0; i < chessBoard.length; i++) {
                if (chessBoard[i][attacking] != 0 && chessBoard[i][attacking] != 1 && chessBoard[i][attacking].getPieceType() == pieceType && chessBoard[i][j].colour == colour) {
                    if (checkIfPieceCanMove(chessBoard[i][attacking], chessBoard, row, column, emptyOrNot)) {
                        rowOfMoving = i;
                        count++;
                    }
                }
            }
            // makes sure that only one piece is given
            if (count != 1) {
                return;
            }
            piece = chessBoard[rowOfMoving][attacking];
            // else if the row is given find the column that the piece that is moving is on and make the move
        } else {
            for (let i = 0; i < chessBoard[attacking].length; i++) {
                if (chessBoard[attacking][i] != 0 && chessBoard[attacking][i] != 1 && chessBoard[attacking][i].getPieceType() == pieceType && chessBoard[i][j].colour == colour) {
                    if (checkIfPieceCanMove(chessBoard[attacking][i], chessBoard, row, column, emptyOrNot)) {
                        columnOfMoving = i;
                        count++;
                    }
                }
            }
            // makes sure that only one piece is given
            if (count != 1) {
                return;
            }
            piece = chessBoard[attacking][columnOfMoving];
        }
        makeMoveHelperFunction(piece.row, piece.column, row, column, chessBoard, colour);
        // if the notation both gives the column and row of the piece then set the piece position to the column and row given then make the move if valid.
    } else if (chessMove.length == 5) {
        row = getRow(chessMove[4]);
        column = letterNotationToNum(chessMove[3]);
        columnOfMoving = letterNotationToNum(chessMove[1]);
        rowOfMoving = getRow(chessMove[2])
        pieceType = letterToPiece(chessMove[0]);
        if (checkIfPieceCanMove(chessBoard[rowOfMoving][columnOfMoving], chessBoard, row, column, emptyOrNot)) {
            makeMoveHelperFunction(rowOfMoving, columnOfMoving, row, column, chessBoard, colour);
        }
    }
}

function makeMoveHelperFunction(i, j, row, column, chessBoard, colour) {
    let valid = 1;
    let coverCheckValue = coverCheck(chessBoard, colour);
    // if there is only one attacker
    if (checkIfKingIsSafe(chessBoard, colour) == 1) {
        if (coverCheckValue.length == 0) {
            return;
        }
        // one attacker case where the thing is touching
        if (coverCheckValue[0] != 0 && coverCheckValue[1].length > 0) {
            // return if the piece moving is not the king and if the piece that is moving does not take the attacker touching the king
            if (!((row == coverCheckValue[1][0] && column == coverCheckValue[1][1]) || chessBoard[i][j].getPieceType() == 'King')) {
                return;
            }
            // if the attacker is not touching the king check if the piece is covering the attack from the king
        } else if (coverCheckValue[0] == 0) {
            valid = 0;
            for (let k = 1; k < coverCheckValue.length; k++) {
                if (coverCheckValue[k][0].includes(chessBoard[i][j])) {
                    if (coverCheckValue[k][1][0] == i && coverCheckValue[k][1][1] == j) {
                        valid = 2;
                    }
                }
            }
        }
        // if there are 2 attackers on the king (ie the attack cannot be covered/stopped by a different piece) and the king is not moving then return
    } else if (checkIfKingIsSafe(chessBoard, colour) == 2) {
        if (chessBoard[i][j].getPieceType() != 'King') {
            return;
        }
    }
    // if there are no possible moves to cover the king and the king is not moving then return
    if (valid == 0) {
        if (chessBoard[i][j].getPieceType() != 'King') {
            return;
        }
    }
    // makes the move and undoes it if the king becomes in danger.
    let stored = chessBoard[row][column];
    chessBoard[row][column] = chessBoard[i][j];
    chessBoard[i][j] = 0;
    chessBoard[row][column].row = row;
    chessBoard[row][column].column = column;
    let king = findKing(chessBoard, colour);
    let attackedPositions = getAllAttackedPositions(chessBoard, 2);
    for (let k = 0; k < attackedPositions.length; k++) {
        if (attackedPositions[k][0] == king.row && attackedPositions[k][1] == king.column) {
            chessBoard[row][column].row = i;
            chessBoard[row][column].column = j;
            chessBoard[i][j] = chessBoard[row][column];
            chessBoard[row][column] = stored;
            return;
        }
    }
    deleteEnPassant(chessBoard);
    // if a rook or a king is moving make sure that they cannot castle afterwards
    if (chessBoard[row][column].getPieceType() == 'Rook' || chessBoard[row][column].getPieceType() == 'King') {
        chessBoard[row][column].castle = 0;
    }
    return;
}

function checkMate(chessBoard, colour) {
    // if the king has no attackers return false
    if (checkIfKingIsSafe(chessBoard, colour) == 0) {
        return false;
    }
    let king = findKing(chessBoard, colour);
    // if the king can move out of danger return false
    if (king.getAttackedPositions(chessBoard).length > 0) {
        return false;
    }
    let movesToCoverCheck = coverCheck(chessBoard, colour);
    if (movesToCoverCheck.length > 0) {
        // if the piece attacking the king is touching the king (we know this because the first variable of the array != 0) and the arrayOfAttackers (which is the first variable of the movesToCoverCheck array in this case)
        // is not empty then return false because the king can be defended.
        if (movesToCoverCheck[0] != 0 && movesToCoverCheck[0].length > 0) {
            return false;
            // if the piece attacking the king is not touching the king (we know this because the first variable == 0) then cycle through the array and if any of the arrays within the array that 
            // that contain the possible pieces that can cover the king from attack are not empty then return false as the king can be defended.
        } else if (movesToCoverCheck[0] == 0) {
            for (let k = 1; k < movesToCoverCheck; k++) {
                if (movesToCoverCheck[k][0].length > 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

// checks if there should be a promotion by checking if a pawn has reached the other side.
function checkForPromotion(chessBoard) {
    for (let j = 0; j < chessBoard[0].length; j++) {
        if (chessBoard[0][j] != 0) {
            if (chessBoard[0][j].getPieceType() == 'Pawn') {
                return true;
            }
        }
        if (chessBoard[7][j] != 0) {
            if (chessBoard[7][j].getPieceType() == 'Pawn') {
                return true;
            }
        }
    }
    return false;
}

// if there is a promotion this function finds the pawn that has reached the end and uses the promotionHelper to find out if the given piece type is valid and if so it replaces the pawn with
// an instance of that piece and return true otherwise it returns false.
function promotion(chessBoard, wantedPiece) {
    for (let j = 0; j < chessBoard[0].length; j++) {
        if (chessBoard[0][j] != 0) {
            if (chessBoard[0][j].getPieceType() == 'Pawn' && !promotionHelper(wantedPiece, chessBoard, 0, j)) {
                return false;
            }
        }
        if (chessBoard[7][j] != 0) {
            if (chessBoard[7][j].getPieceType() == 'Pawn' && !promotionHelper(wantedPiece, chessBoard, 7, j)) {
                return false;
            }
        }
    }
    return true;
}
function promotionHelper(wantedPiece, chessBoard, row, column) {
    wantedPiece = wantedPiece.toLowerCase();
    if (wantedPiece == 'knight') {
        chessBoard[row][column] = new Knight(chessBoard[row][column].colour, row, column)
    } else if (wantedPiece == 'rook') {
        chessBoard[row][column] = new Rook(chessBoard[row][column].colour, row, column)
    } else if (wantedPiece == 'bishop') {
        chessBoard[row][column] = new Bishop(chessBoard[row][column].colour, row, column)
    } else if (wantedPiece == 'queen') {
        chessBoard[row][column] = new Queen(chessBoard[row][column].colour, row, column)
    }
    return false;
}

function createNewChessBoard() {
    let pa2 = new Pawn(1, 1, 0);
    let pb2 = new Pawn(1, 1, 1);
    let pc2 = new Pawn(1, 1, 2);
    let pd2 = new Pawn(1, 1, 3);
    let pe2 = new Pawn(1, 1, 4);
    let pf2 = new Pawn(1, 1, 5);
    let pg2 = new Pawn(1, 1, 6);
    let ph2 = new Pawn(1, 1, 7);
    let ra1 = new Rook(1, 0, 0);
    let rh1 = new Rook(1, 0, 7);
    let kNb1 = new Knight(1, 0, 1);
    let kNg1 = new Knight(1, 0, 6);
    let bc1 = new Bishop(1, 0, 2);
    let bf1 = new Bishop(1, 0, 5);
    let qd1 = new Queen(1, 0, 3);
    let ke1 = new King(1, 0, 4);

    let pa7 = new Pawn(0, 6, 0);
    let pb7 = new Pawn(0, 6, 1);
    let pc7 = new Pawn(0, 6, 2);
    let pd7 = new Pawn(0, 6, 3);
    let pe7 = new Pawn(0, 6, 4);
    let pf7 = new Pawn(0, 6, 5);
    let pg7 = new Pawn(0, 6, 6);
    let ph7 = new Pawn(0, 6, 7);
    let ra8 = new Rook(0, 7, 0);
    let rh8 = new Rook(0, 7, 7);
    let kNb8 = new Knight(0, 7, 1);
    let kNg8 = new Knight(0, 7, 6);
    let bc8 = new Bishop(0, 7, 2);
    let bf8 = new Bishop(0, 7, 5);
    let qd8 = new Queen(0, 7, 3);
    let ke8 = new King(0, 7, 4);

    let chessBoard = [
        [ra1, kNb1, bc1, qd1, ke1, bf1, kNg1, rh1],
        [pa2, pb2, pc2, pd2, pe2, pf2, pg2, ph2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [pa7, pb7, pc7, pd7, pe7, pf7, pg7, ph7],
        [ra8, kNb8, bc8, qd8, ke8, bf8, kNg8, rh8]
    ];
    return chessBoard;
}

module.exports = { makeMove, createNewChessBoard, castling, getAllAttackedPositions, checkMate, promotion, checkForPromotion, stalemate };