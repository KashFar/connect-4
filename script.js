let body = document.querySelector('body');
let mainDiv = document.getElementById('board')

let scoreDiv = document.getElementById('score')
let redWinCount = 0;
let blueWinCount = 0;
let placedPieces = 0;

let columnCount = 7
let rowCount = 6
let connectCount = 4

let turn = 'red'; 
let gameOver = false;

let player1 = 'red';
let player2 = 'blue';

buildBoard(mainDiv)
updatescore(redWinCount,blueWinCount)

// creates the columns
function createColumns(i) {
    let newColumn = document.createElement('div')
    newColumn.classList.add('column')
    newColumn.id = "column"+i
    newColumn.addEventListener('click', clickHandler)
    return newColumn
}

//creates cells
function createCell(i,j) {
    let newCell = document.createElement('div')
    newCell.classList.add('cell')
    newCell.id = "cell" + i + '-' + j
    return newCell
}

//builds the game board  
function buildBoard(div) {
    for (let i = 0; i < columnCount; i++) {
        let newColumn = createColumns(i)
        for (let j = 0; j < rowCount; j++) {
            let newCell = createCell(i,j)
            newColumn.appendChild(newCell)
        }
        div.appendChild(newColumn)
    }
}

function createPiece() {
    let newPiece = document.createElement('div')
    if (turn=="red") {
        newPiece.classList.add('piece-red') 
        newPiece.style.backgroundImage = "url(./img/red.png)"
    } else if (turn=="blue") {
        newPiece.classList.add('piece-blue')
        newPiece.style.backgroundImage = "url(./img/blue.png)"
    }
    return newPiece
}

function placePiece(curColCells) {
    if (curColCells[0].childElementCount!==0){
        alert('column full, choose different column')
        return
    } 
    newPiece = createPiece()

    for (let i = 0; i <= curColCells.length-1; i++) {
        let curCell = curColCells[i]
        let cellBelow = curColCells[i+1]
        //if at bottom place piece
        if (i == curColCells.length-1) {
            curCell.appendChild(newPiece)
            placedPieces++
            break
        //else if cell below contains piece, place piece here
        } else if(cellBelow.childElementCount!==0){
            curCell.appendChild(newPiece)
            placedPieces++
            break
        }
    }
    if (turn=="red") { 
        turn = "blue"
    } else if (turn=="blue") {
        turn = "red" 
    }
}

//check board for vertical win
function vertWinCheck(board) {
    let checkEdge = connectCount-1
    for(let i = 0; i < board.length; i++) {
        let colCells = board[i].children
        for(let j = 0; j < colCells.length-checkEdge; j++) {
            let curColCell = colCells[j]
            let checkArray = []
            checkArray.push(curColCell)
            for (let k = 1; k < connectCount; k++) {
                checkArray.push(colCells[j+k])
            }
            checkForWin(checkArray)
        }
    }
}

//check board for horizontal win 
function horizWinCheck(board) {
    let checkEdge = connectCount-1
    for(let i = 0; i < board.length-checkEdge; i++) {
        let colCells = board[i].children    
        for(let j = 0; j < colCells.length; j++) {
            let curColCell = colCells[j]
            let checkArray = []
            checkArray.push(curColCell)
            for (let k = 1; k < connectCount; k++){
                checkArray.push(board[i+k].children[j])
            }
            
            checkForWin(checkArray)
        }
    }
}

//check board for diagonal upwards win 
function diagUpWin(board) {
    let checkEdge = connectCount-1
    for(let i = 0; i < board.length-checkEdge; i++) {
        let colCells = board[i].children    
        for(let j = 0; j < colCells.length-checkEdge; j++) {
            let curColCell = colCells[j]
            let checkArray = []
            checkArray.push(curColCell)
            for (let k = 1; k < connectCount; k++) {
                checkArray.push(board[i+k].children[j+k])
            }

            checkForWin(checkArray)
        }
    }
}

//checks board for diagonal downwards win 
function diagDownWin(board) {
    let checkEdge = connectCount-1
    for(let i = 0; i < board.length-checkEdge; i++) {
        let colCells = board[i].children  
        for(let j = checkEdge; j < colCells.length; j++) {
            let curColCell = colCells[j]
            let checkArray = []
            checkArray.push(curColCell)
            for (let k = 1; k < connectCount; k++) {
                checkArray.push(board[i+k].children[j-k])
            }
            checkForWin(checkArray)
        }
    }
}



function checkForWin(checkArray) {
    let redPieceCount = 0
    let bluePieceCount = 0
    for (let k = 0; k < checkArray.length; k++) {
        if (checkArray[k].firstChild) {
            if (checkArray[k].firstChild.classList.contains('piece-red')) {
                redPieceCount++ 
                checkArray[k] = checkArray[k].firstChild
            } else if (checkArray[k].firstChild.classList.contains('piece-blue')) {
                bluePieceCount++
                checkArray[k] = checkArray[k].firstChild
            } else {
                break
            }
        } else {
            break
        }
    }
    
    if (redPieceCount==connectCount) {
        redWinCount++
        winner(player1,checkArray)
        return
    } else if (bluePieceCount==connectCount) {
        blueWinCount++
        winner(player2,checkArray)
        return
    }
}

//updates score
function updatescore(redWinCount,blueWinCount) {
    scoreDiv.innerHTML = ''
    
    let playersDiv = document.createElement('div')
    playersDiv.id = 'players'
    playersDiv.style.textDecoration = 'underline'
    let scoresDiv = document.createElement('div')

    let playersText = document.createTextNode(player1 + ' vs. ' + player2)
    let scoresText = document.createTextNode(redWinCount + ' to ' + blueWinCount)
    
    playersDiv.appendChild(playersText)
    scoresDiv.appendChild(scoresText)
    scoreDiv.appendChild(playersDiv)
    scoreDiv.appendChild(scoresDiv)
    return scoreDiv
}


function createWinDiv(color) {
    let winDiv = document.getElementById('winner')
    winDiv.innerHTML = ''
    winDiv.style.marginTop = 10 + 'px'
    winDiv.style.textAlign = 'center'
    winDiv.style.display = 'flex'
    winDiv.style.flexDirection = 'column'
    winDiv.style.alignItems = 'center'
    let winText = document.createTextNode(color +' wins ')
    winDiv.appendChild(winText)
    return winDiv
}

function createResetButton(mainDiv,winDiv) {
    let resetButton = document.createElement('button')
    resetButton.type = 'button'
    resetButton.id = 'reset-button'
    resetButton.innerHTML = 'Reset the Game Loser'
    resetButton.style.marginTop = 10 + 'px'
    resetButton.onclick = function reset() {
        mainDiv.innerHTML = ''
        if (winDiv) winDiv.innerHTML = ''
        buildBoard(mainDiv)
        gameOver = false
        placedPieces = 0
    }
    return resetButton
}

//applies win condition
function winner(color,checkArray) {
    for (let i = 0; i < checkArray.length; i++) {
        checkArray[i].classList.add('winnerCell')
    }
    let winDiv = createWinDiv(color)
    let resetButton = createResetButton(mainDiv,winDiv)
    let scoreDiv = updatescore(redWinCount,blueWinCount)
    winDiv.appendChild(resetButton)
    body.appendChild(scoreDiv)
    body.appendChild(winDiv)
    gameOver = true
}

//handles clicks
function clickHandler(event) {
    if(gameOver==false){
        let curTar = event.currentTarget
        let curColCells = curTar.children
        let board = mainDiv.children
        
        placePiece(curColCells)
        vertWinCheck(board)
        horizWinCheck(board)
        diagUpWin(board)
        diagDownWin(board)
        if(placedPieces==columnCount*rowCount) {
            gameOver = true
            redWinCount+=0.5
            blueWinCount+=0.5
            let winDiv = createWinDiv('tie, no one')
            let resetButton = createResetButton(mainDiv,winDiv)
            let scoreDiv = updatescore(redWinCount,blueWinCount)
            winDiv.appendChild(resetButton)
            body.appendChild(scoreDiv)
            body.appendChild(winDiv)
        }
        let tempPiece = createPiece()
        body.addEventListener('mouseover', (event) => {
        tempPiece.id = 'tempPiece'
        tempPiece.style.position = 'absolute'
        tempPiece.style.height = 100+'px'
        tempPiece.style.width = 100+'px'
        tempPiece.style.top = event.clientY - 130 + 'px'
        tempPiece.style.left = event.clientX - 50 + 'px'
        body.appendChild(tempPiece)
    })
    } else {
        alert('game is over, click reset button to play another')
    }
}
