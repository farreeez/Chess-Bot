function getRookAttacks(row, column, chessBoard, colour) {
    let arrayOfAttackedPositions = [];
    let a = row - 1;
    let b = column;
    // gets all the empty positions that the rook can move to above the position of the rook
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        a--;
    }
    // adds the position after the empty positions if it is of the opposite colour
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    a = row + 1;
    b = column;
    // gets all the empty positions that the rook can move to below the position of the rook
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        a++;
    }
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    a = row;
    b = column + 1;
    // gets all the empty positions that the rook can move to to the right of the position of the rook
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        b++;
    }
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    a = row;
    b = column - 1;
    // gets all the empty positions that the rook can move to to the left of the position of the rook
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        b--;
    }
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    return arrayOfAttackedPositions;
}

function getBishopAttacks(row, column, chessBoard, colour) {
    let arrayOfAttackedPositions = [];
    let a = row - 1;
    let b = column + 1;
    // gets all the empty positions that the bishop can move to on the top right diagonal
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        a--;
        b++;
    }
    // adds the position after the empty positions if it is of the opposite colour
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    a = row - 1;
    b = column - 1;
    // gets all the empty positions that the bishop can move to on the top left diagonal
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        a--;
        b--;
    }
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    a = row + 1;
    b = column + 1;
    // gets all the empty positions that the bishop can move to on the bottom left diagonal
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        a++;
        b++;
    }
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    a = row + 1;
    b = column - 1;
    // gets all the empty positions that the bishop can move to on the bottom right diagonal
    while (a >= 0 && a <= 7 && b >= 0 && b <= 7 && (chessBoard[a][b] == 0 || chessBoard[a][b] == 1)) {
        arrayOfAttackedPositions.push([a, b]);
        a++;
        b--;
    }
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7 && chessBoard[a][b].colour != colour) {
        arrayOfAttackedPositions.push([a, b]);
    }
    return arrayOfAttackedPositions;
}

// cycles through the board and compiles all the positions that could be possibly attacked by a colour into an array
function getAllAttackedPositions(chessBoard, colour) {
    let allAttackedPositions = [];
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] !== 0 && chessBoard[i][j] !== 1) {
                if (colour == 2 || chessBoard[i][j].colour == colour) {
                    let attackedPositions = chessBoard[i][j].getAttackedPositions(chessBoard);
                    if (attackedPositions.length == 1) {
                        allAttackedPositions.push(attackedPositions[0]);
                    } else if (attackedPositions.length > 1) {
                        for (let k = 0; k < attackedPositions.length; k++) {
                            allAttackedPositions.push(attackedPositions[k]);
                        }
                    }
                }
            }
        }
    }
    return allAttackedPositions;
}


function kingNotSafe(chessBoard, colour, arrayOfAttackedPositions) {
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            // cycles through the chess board to find non king pieces of the different colour
            if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1 && chessBoard[i][j].getPieceType() != 'King' && chessBoard[i][j].colour != colour) {
                // gets the positions that those pieces can attack and checks if it includes the position that the king can move to and if it does it removes that position from the array of positions by setting
                // the position to 0 and then removing all the 0s
                if (chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard).length == 1) {
                    for (let l = 0; l < arrayOfAttackedPositions.length; l++) {
                        if (chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard)[0][0] == arrayOfAttackedPositions[l][0] && chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard)[0][1] == arrayOfAttackedPositions[l][1]) {
                            arrayOfAttackedPositions[l] = 0
                        }
                    }
                } else if (chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard).length > 1) {
                    for (let k = 0; k < chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard).length; k++) {
                        for (let l = 0; l < arrayOfAttackedPositions.length; l++) {
                            if (chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard)[k][0] == arrayOfAttackedPositions[l][0] && chessBoard[i][j].getAttackedPositionsKingVersion(chessBoard)[k][1] == arrayOfAttackedPositions[l][1]) {
                                arrayOfAttackedPositions[l] = 0;
                            }
                        }
                    }
                }
            }
        }
    }
    if (arrayOfAttackedPositions.length == 0) {
        return;
    }
    // removes all the 0s
    while (arrayOfAttackedPositions.includes(0)) {
        for (let i = 0; i < arrayOfAttackedPositions.length; i++) {
            if (arrayOfAttackedPositions[i] == 0) {
                arrayOfAttackedPositions.splice(0, 1);
                break;
            }
        }
    }
}

// adds a position to attackedPositions array if it is empty or of the opposite colour
function addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions) {
    if (a >= 0 && a <= 7 && b >= 0 && b <= 7) {
        if ((chessBoard[a][b] == 0 || chessBoard[a][b] == 1) || chessBoard[a][b].colour != colour) {
            arrayOfAttackedPositions.push([a, b]);
        }
    }
}

class Pawn {
    constructor(colour, row, column) {
        // set the colour of the pawn 1 represents black 0 represents white
        this.colour = colour;
        this.row = row;
        this.column = column;
        this.typeValue = 2;
        this.Passant = 0;
    }

    getPieceType() {
        return "Pawn";
    }

    // gets all the position that the pawn can take of a certain colour
    getAttackedPositionsHelper(chessBoard, colour) {
        let arrayOfAttackedPositions = [];
        if (colour == 0) {
            let a = this.row - 1;
            let b = this.column + 1;
            addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
            b = this.column - 1;
            addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        } else {
            let a = this.row + 1;
            let b = this.column + 1;
            addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
            b = this.column - 1;
            addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        }
        return arrayOfAttackedPositions;
    }

    // takes pieces of the opposite colour
    getAllAttackedPositions(chessBoard){
        let colour;
        if (this.colour == 1) {
            colour = 0;
        } else {
            colour = 1;
        }

        return getAllAttackedPositions(chessBoard, colour);
    }


    getAttackedPositionsKingVersion(chessBoard) {
        return getAllAttackedPositions(chessBoard, this.colour);
    }

    // makes the square behind it equal to 1 if enpassan is allowed
    enPassant(chessBoard) {
        if (this.colour == 0) {
            chessBoard[this.row - 1][this.column] = 1;
        } else if (this.colour == 1) {
            chessBoard[this.row + 1][this.column] = 1;
        }
        this.Passant = 1;
    }

    getPassant() {
        return this.Passant;
    }
}

// constructor for King
class King {
    constructor(colour, row, column) {
        this.colour = colour;
        this.row = row;
        this.column = column;
        this.castle = 1;
        this.typeValue = 7;
    }

    getPieceType() {
        return "King";
    }

    // returns possible positions that the king can move to
    getAttackedPositions(chessBoard) {
        let arrayOfAttackedPositions = [];
        let a = this.row - 1;
        let b = this.column;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        a = this.row + 1;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        b = this.column + 1;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        b = this.column - 1;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        a = this.row - 1;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        b = this.column + 1;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        a = this.row;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        b = this.column - 1;
        addToAttackedPositions(a, b, chessBoard, this.colour, arrayOfAttackedPositions);
        kingNotSafe(chessBoard, this.colour, arrayOfAttackedPositions);
        return arrayOfAttackedPositions;
    }

    getCastle() {
        return this.castle;
    }
}

// constructor for Rook
class Rook {
    constructor(colour, row, column) {
        // set the colour of the pawn 1 represents black 0 represents white
        this.colour = colour;
        this.row = row;
        this.column = column;
        this.castle = 1;
        this.typeValue = 5;
    }

    getPieceType() {
        return "Rook";
    }

    // gets rook attacks on empty positions or pieces of the opposite colour
    getAttackedPositions(chessBoard) {
        return getRookAttacks(this.row, this.column, chessBoard, this.colour);
    }

    // gets rook attacks on empty positions or pieces of the same colour
    getAttackedPositionsKingVersion(chessBoard) {
        let colour;
        if (this.colour == 1) {
            colour = 0;
        } else {
            colour = 1;
        }

        return getRookAttacks(this.row, this.column, chessBoard, colour);
    }

    getCastle() {
        return this.castle;
    }
}

// constructor for Knight
class Knight {
    constructor(colour, row, column) {
        // set the colour of the pawn 1 represents black 0 represents white
        this.colour = colour;
        this.row = row;
        this.column = column;
        this.typeValue = 3;
    }

    getPieceType() {
        return "Knight";
    }

    getAttackedPositionsHelper(chessBoard, colour) {
        let arrayOfAttackedPositions = [];
        let a = this.row - 2;
        let b = this.column + 1;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        b = this.column - 1;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        a = this.row - 1;
        b = this.column - 2;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        b = this.column + 2;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        a = this.row + 1;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        b = this.column - 2;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        a = this.row + 2;
        b = this.column + 1;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        b = this.column - 1;
        addToAttackedPositions(a, b, chessBoard, colour, arrayOfAttackedPositions);
        return arrayOfAttackedPositions;
    }

    // gets knight attacks on empty positions or pieces of the opposite colour
    getAttackedPositions(chessBoard) {
        return getAttackedPositionsHelper(chessBoard, this.colour)
    }

    getAttackedPositionsKingVersion(chessBoard) {
        let colour;
        if (this.colour == 1) {
            colour = 0;
        } else {
            colour = 1;
        }

        // gets knight attacks on empty positions or pieces of the same colour
        return getAttackedPositionsHelper(chessBoard, colour);
    }

}

// constructor for Bishop
class Bishop {
    constructor(colour, row, column) {
        // set the colour of the pawn 1 represents black 0 represents white
        this.colour = colour;
        this.row = row;
        this.column = column;
        this.typeValue = 4;
    }

    getPieceType() {
        return "Bishop";
    }

    // gets bishop attacks on empty positions or pieces of the opposite colour
    getAttackedPositions(chessBoard) {
        return getBishopAttacks(this.row, this.column, chessBoard, this.colour);
    }

    // gets bishop attacks on empty positions or pieces of the same colour
    getAttackedPositionsKingVersion(chessBoard) {
        let colour;
        if (this.colour == 1) {
            colour = 0;
        } else {
            colour = 1;
        }

        return getBishopAttacks(this.row, this.column, chessBoard, colour);
    }
}

// constructor for Queen
class Queen {
    constructor(colour, row, column) {
        // set the colour of the pawn 1 represents black 0 represents white
        this.colour = colour;
        this.row = row;
        this.column = column;
        this.typeValue = 6;
    }

    getPieceType() {
        return "Queen";
    }

    // gets queen attacks on empty positions or pieces of the opposite colour
    getAttackedPositions(chessBoard) {
        let arrayOfAttackedPositions = getRookAttacks(this.row, this.column, chessBoard, this.colour);
        for (let i = 0; i < getBishopAttacks(this.row, this.column, chessBoard, this.colour).length; i++) {
            arrayOfAttackedPositions.push(getBishopAttacks(this.row, this.column, chessBoard, this.colour)[i])
        }
        return arrayOfAttackedPositions;
    }

    // gets bishop attacks on empty positions or pieces of the same colour
    getAttackedPositionsKingVersion(chessBoard) {
        let colour;
        if (this.colour == 1) {
            colour = 0;
        } else {
            colour = 1;
        }

        let arrayOfAttackedPositions = getRookAttacks(this.row, this.column, chessBoard, colour);
        for (let i = 0; i < getBishopAttacks(this.row, this.column, chessBoard, colour).length; i++) {
            arrayOfAttackedPositions.push(getBishopAttacks(this.row, this.column, chessBoard, colour)[i])
        }
        return arrayOfAttackedPositions;
    }
}

// returns the file name for the image of a piece
function getPieceImage(piece) {
    if (piece.colour == 1) {
        return "images/black" + piece.getPieceType() + ".png";
    } else {
        return "images/white" + piece.getPieceType() + ".png";
    }
}

module.exports = { Queen, Bishop, Knight, Pawn, King, Rook, getAllAttackedPositions, getPieceImage }