require("dotenv").config(); //to start process from .env file
const { Client, GatewayIntentBits } = require('discord.js');
const { createNewChessBoard, castling, makeMove, checkMate, promotion, checkForPromotion, stalemate } = require('./chess.js');
const { checkIfChessNotiationValid, chessBoardImg } = require('./ChessGui.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]
})

client.once("ready", () => {
    console.log("BOT IS ONLINE"); //message when bot is online
})


client.on('messageCreate', (message) => {
    // checks if the messages are sent in the correct text channel on the server.
    if (message.channel.id != 1101503710535880855) {
        return;
    }
    // game is starte if the command is used.
    if (message.content == "-play chess" && !message.author.bot) {
        // player one is the player that initiated the game.
        let player2;
        let colour1;
        let colour2;
        let player1 = message.author;
        let arrayOfPlayers = [];
        // only accepts responses from the user that initiated the game
        let filter = m => m.author.id === message.author.id
        message.channel.send('please tag the player you are playing with and which colour you would like to play as (w for white and b for black) you have 60 seconds to do so.')
        message.channel.awaitMessages({
            filter: filter,
            max: 1,
            time: 600000
        })
            .then(message => {
                message = message.first()
                if (message.content.match(/<@.?[0-9]*?>/g) && (message.content.toLowerCase().includes('w') ^ message.content.toLowerCase().includes('b'))) {
                    if (!message.mentions.members.first().user.bot) {
                        player2 = message.mentions.members.first();
                    } else {
                        message.channel.send('invalid response, game terminated');
                    }
                    // 0 is for white and 1 is for black.
                    if (message.content.toLowerCase().includes('w')) {
                        colour1 = 0;
                        colour2 = 1;
                    } else if (message.content.toLowerCase().includes('b')) {
                        colour1 = 1;
                        colour2 = 0;
                    }
                    // makes whoever is white have the first turn so that the colour number corresponds to their position in the array.
                    if (colour1 == 0) {
                        arrayOfPlayers.push(player1);
                        arrayOfPlayers.push(player2);
                    } else if (colour2 == 0) {
                        arrayOfPlayers.push(player2);
                        arrayOfPlayers.push(player1);
                    }
                    message.channel.send('player1 what do you want to name your game you have 60 seconds to respond (the name cannot be longer than 25 characters and cannot contain special characters any extra characters will be removed.)');
                    filter = m => m.author.id === player1.id
                    message.channel.awaitMessages({
                        filter: filter,
                        max: 1,
                        time: 60000
                    }).then(message => {
                        message = message.first();
                        let messageString = message.cleanContent.toLowerCase();
                        // replaces spaces with - to fit discord's naming criteria
                        messageString = messageString.replaceAll(" ", "-");
                        // removes special characters.
                        let messageChar = messageString.split('');
                        for (let i = 0; i < messageString.length; i++) {
                            if (!(messageString.codePointAt(i) >= 97 && messageString.charCodeAt(i) <= 122) && messageString.charCodeAt(i) != 45) {
                                messageChar[i] = " ";
                            }
                        }
                        messageString = messageChar.join('');
                        messageString = messageString.replaceAll(" ", "");
                        messageString = messageString.split('');
                        // deletes extra characters if the length is bigger than 25
                        if (messageString.length > 25) {
                            for (let i = 25; i < messageString.length; i++) {
                                messageString[i] = " ";
                            }
                        }
                        messageString = messageString.join('');
                        messageString = messageString.replaceAll(" ", "");
                        // gives a generic name if no name is entered by the player
                        if (messageString.length == 0) {
                            messageString = "new-chess-game"
                        }
                        // creates a thread with the name given by the user
                        const thread = message.channel.threads.create({
                            name: messageString,
                            autoArchiveDuration: 60,
                            reason: 'thread for a new chessgame'
                        })
                            .then(async (thread) => {
                                let chessBoard = new createNewChessBoard();
                                gameStatus = 1;
                                // sends the starting board
                                await chessBoardImg(chessBoard);
                                await thread.send("the game has started it is White's turn to play");
                                await thread.send({ files: ["finalBoardImgs/finalBoard.png"] });
                                // a function that keeps asking the players for their turn 
                                await chessGameInteraction(arrayOfPlayers, thread, chessBoard);
                            }).catch(err => {
                                message.channel.send('invalid response, game terminated');
                                console.log(err);
                            })
                    })
                        .catch(err => {
                            message.channel.send('invalid response, game terminated');
                            console.log(err);
                        })
                } else {
                    message.channel.send('invalid response, game terminated.');
                }
            }).catch(collected => {
                message.channel.send('invalid response, game terminated.');
            })
    }
})

async function chessGameInteraction(arrayOfPlayers, thread, chessBoard) {
    // colour 0 is for white and 1 is for black.
    let colour = 0;
    let gameStatus = 1;
    let colourConverter = -1;
    // array used to keep track of any possible repetitions for 3 repetition draw.
    let arrayOfChessBoards = [];
    while (gameStatus == 1) {
        await new Promise((resolve, reject) => {
            // only accepts messages from whichever colour the turn is currently for
            const filter = (m) => m.author.id === arrayOfPlayers[colour].id
            thread.awaitMessages({
                filter: filter,
                max: 1,
                time: 1200000
            })
                .then(async (message) => {
                    // makes a fake (instances within the array are replaced with integers with each instance having a unique integer) copy of the board before the turn
                    let beginningBoard = fakeCopyOfChessBoard(chessBoard);
                    message = message.first();
                    chessMove = message.toString();
                    // if the user responds with end game the game ends
                    if (chessMove == "end game") {
                        gameStatus = 0;
                        thread.send("game has ended");
                        return;
                    }
                    // checks if the player wants to castle and castles if allowed.
                    castling(chessMove, chessBoard, colour);
                    // makes the enemy colour the opposite of the current colour.
                    colourConverter = colourConverter * -1
                    let enemyColour = colour + colourConverter;
                    if (checkIfChessNotiationValid(chessMove)) {
                        makeMove(chessMove, chessBoard, colour);
                        // if there is a promotion asks the player what to promote to and replaces the pawn with an instance of that piece.
                        if (checkForPromotion(chessBoard)) {
                            let needPromotion = true;
                            thread.send(arrayOfPlayers[colour].tag + " has a promoted pawn please respond with the name of the piece that you would like (options are : knight, queen, bishop, rook)")
                            await checkForPromotionHelper(needPromotion, arrayOfPlayers, thread, chessBoard, colour);
                        }
                        if (checkMate(chessBoard, enemyColour)) {
                            gameStatus = 0;
                            thread.send("game over checkmate");
                        }
                    }
                    await chessBoardImg(chessBoard);
                    let endBoard = fakeCopyOfChessBoard(chessBoard);
                    // makes the current colour the enemy colour for the next turn
                    colour = enemyColour;
                    setTimeout(function () {
                        // if the board has not changed after the player has inputed their message (due to the move not having the proper notation or due to the move being illegal)
                        // then it asks the player for a new move and changes the colours back.
                        if (compareTwoChessBoards(beginningBoard, endBoard)) {
                            colourConverter = colourConverter * -1;
                            colour = colour + colourConverter;
                            thread.send("Invalid move please try again")
                        } else {
                            // if a piece is removed/taken from the board the array of boards is cleared as repetition within the already stored boards is no longer possible this is done to avoid 
                            // indexing through redundant boards.
                            if (arrayOfChessBoards.length > 0) {
                                if (pieceCount(endBoard) < pieceCount(arrayOfChessBoards[0])) {
                                    clearArray(arrayOfChessBoards);
                                }
                            }
                            arrayOfChessBoards.push(endBoard);
                            if (repetition(arrayOfChessBoards, endBoard)) {
                                gameStatus = 0;
                                thread.send("game over due to draw by repetition");
                            } else if (stalemate(endBoard, enemyColour)) {
                                gameStatus = 0;
                                thread.send({ files: ["finalBoardImgs/finalBoard.png"] });
                                thread.send("game is over due to drwa by stalemate");
                            } else {
                                if (!checkMate(chessBoard, enemyColour)) {
                                    thread.send(`It is ${colourNumToStr(colour)}'s turn`);
                                }
                                thread.send({ files: ["finalBoardImgs/finalBoard.png"] });
                            }
                        }
                    }, 100);
                    resolve();
                })
                .catch(err => {
                    reject();
                    thread.send("some error occured game has sadly terminated");
                    console.log(err)
                });
        }).catch(collected => {
            console.log(collected)
        })
    }
}

async function checkForPromotionHelper(needPromotion, arrayOfPlayers, thread, chessBoard, colour) {
    // keeps asking the player for input until an appropriate response is received for promotion of a pawn
    while (needPromotion) {
        await new Promise((resolve1, reject1) => {
            const filter = (m) => m.author.id === arrayOfPlayers[colour].id
            thread.awaitMessages({
                filter,
                max: 1
            }).then(async (message) => {
                message = message.first();
                let wantedPiece = message.toString();
                needPromotion = promotion(chessBoard, wantedPiece);
                resolve1()
            }).catch(message => {
                reject1()
                thread.send('some error occured game has sadly terminated')
            })
        })
    }
}

function colourNumToStr(colour) {
    if (colour == 1) {
        return "Black";
    } else {
        return "White";
    }
}

// makes a fake copy of the chessboard by replacing instances with their typevalues
function fakeCopyOfChessBoard(chessBoard) {
    let fakeChessBoard = [];
    for (let i = 0; i < chessBoard.length; i++) {
        fakeChessBoard.push([]);
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] == 1 || chessBoard[i][j] == 0) {
                fakeChessBoard[i].push(chessBoard[i][j]);
            } else {
                if (chessBoard[i][j].colour == 1) {
                    fakeChessBoard[i].push(-chessBoard[i][j].typeValue);
                } else {
                    fakeChessBoard[i].push(chessBoard[i][j].typeValue);
                }
            }
        }
    }
    return fakeChessBoard;
}

// compares 2 8x8 arrays and returns true if they are identical
function compareTwoChessBoards(chessBoard, chessBoard1) {
    let notMatching = false;
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] != chessBoard1[i][j]) {
                notMatching = true;
                break;
            }
        }
        if (notMatching) {
            break;
        }
    }
    if (!notMatching) {
        return true;
    } else {
        return false;
    }
}

// counts the number of pieces on the board
function pieceCount(chessBoard) {
    let count = 0;
    for (let i = 0; i < chessBoard.length; i++) {
        for (let j = 0; j < chessBoard[i].length; j++) {
            if (chessBoard[i][j] != 0 && chessBoard[i][j] != 1) {
                count++;
            }
        }
    }
    return count;
}

// checks if an board has been repeated 3 times within the array of boards
function repetition(arrayOfBoards, chessBoard) {
    let count = 0;
    for (let i = 0; i < arrayOfBoards.length; i++) {
        if (compareTwoChessBoards(arrayOfBoards[i], chessBoard)) {
            count++
        }
    }
    if (count > 2) {
        return true;
    }
    return false;
}

function clearArray(array) {
    while (array.length > 0) {
        array.pop();
    }
}


client.login(process.env.TOKEN);