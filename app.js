const GB_ARRAY_HEIGHT = 20,
      GB_ARRAY_WIDTH = 12,
      SQUARE_SIDE_SIZE = 21,
      SQUARE_MARGIN = 2,
      SQUARE_BOX_SIZE = SQUARE_SIDE_SIZE + SQUARE_MARGIN,
      DIRECTION = {
                    IDLE: 0,
                    DOWN: 1,
                    LEFT: 2,
                    RIGHT: 3
                  },
      TETROMINOS_COLORS = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];

let canvas,
    ctx,
    coordinateArray = [...Array(GB_ARRAY_HEIGHT)].map(e => Array(GB_ARRAY_WIDTH).fill(0)),
    tetrominos = [],
    curTetromino = [],
    curTetrominoColor,
    gameBoardArray = [...Array(GB_ARRAY_HEIGHT)].map(e => Array(GB_ARRAY_WIDTH).fill(0)),
    direction,
    startX = 4,
    startY = 0;

class Coordinates {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

function CreateCoordArray() {
  const initialCoordX = 11,
        endCoordX = 264,
        initialCoordY = 9,
        endCoordY = 446;
  
  let i = 0,
      j = 0;

  for (let y = initialCoordY; y <= endCoordY; y += SQUARE_BOX_SIZE) {
    for (let x = initialCoordX; x <= endCoordX; x += SQUARE_BOX_SIZE) {
      coordinateArray[i][j] = new Coordinates(x, y);
      i++;
    }
    j++;
    i = 0;
  }
}

function SetupCanvas() {
  const canvasWidth = 936,
        canvasHeight = 956,
        boardPositionX = 8,
        boardPositionY = 8,
        boardWidth = 280,
        boardHeight = 462;

  canvas = document.getElementById('my-canvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.scale(2,2);

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(boardPositionX, boardPositionY, boardWidth, boardHeight);

  document.addEventListener('keydown', HandleKeyPress);
  CreateTetrominos();
  CreateTetromino();

  CreateCoordArray();
  DrawTetromino();
}

function DrawTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX,
        y = curTetromino[i][1] + startY;

    gameBoardArray[x][y] = 1;
    let coorX = coordinateArray[x][y].x,
        coorY = coordinateArray[x][y].y;

    ctx.fillStyle = curTetrominoColor;
    ctx.fillRect(coorX, coorY, SQUARE_SIDE_SIZE, SQUARE_SIDE_SIZE);
  }
}

function DeleteTetromino() {
  for (let i = 0; i < curTetromino.length; i++) {
    let x = curTetromino[i][0] + startX,
        y = curTetromino[i][1] + startY;
    
    gameBoardArray[x][y] = 0;
    let coorX = coordinateArray[x][y].x;
        coorY = coordinateArray[x][y].y;

    ctx.fillStyle = 'white';
    ctx.fillRect(coorX, coorY, SQUARE_SIDE_SIZE, SQUARE_SIDE_SIZE);
  }  
}

function CreateTetrominos() {
  // Push T
  tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
  // Push I
  tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
  // Push J
  tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
  // Push Square
  tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
  // Push L
  tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
  // Push S
  tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
  // Push Z
  tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino() {
  let randomTetromino = Math.floor(Math.random() * tetrominos.length);
  curTetromino = tetrominos[randomTetromino];
  curTetrominoColor = TETROMINOS_COLORS[randomTetromino];
}

function HandleKeyPress(key) {
  if (key.keyCode === 65) {
    direction = DIRECTION.LEFT;
    DeleteTetromino();
    startX--;
    DrawTetromino();
  } else if (key.keyCode === 68) {
    direction = DIRECTION.RIGHT;
    DeleteTetromino();
    startX++;
    DrawTetromino();
  } else if (key.keyCode === 83) {
    direction = DIRECTION.DOWN;
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}