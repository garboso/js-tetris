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
    stoppedShapeArray = [...Array(GB_ARRAY_HEIGHT)].map(e => Array(GB_ARRAY_WIDTH).fill(0)),
    tetrominos = [],
    curTetromino = [],
    curTetrominoColor,
    gameBoardArray = [...Array(GB_ARRAY_HEIGHT)].map(e => Array(GB_ARRAY_WIDTH).fill(0)),
    direction,
    startX = 4,
    startY = 0;

let score = 0,
level = 1,
tetrisLogo,
winOrLose = 'Playing';


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
        canvasHeight = 956;

  canvas = document.getElementById('my-canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx = canvas.getContext('2d');
  ctx.scale(2,2);

  DrawBoard(canvas);
  DrawInfo(canvas);

  document.addEventListener('keydown', HandleKeyPress);
  CreateTetrominos();
  CreateTetromino();

  CreateCoordArray();
  DrawTetromino();
}

function DrawBoard(canvas) {
  const boardPositionX = 8,
        boardPositionY = 8,
        boardWidth = 280,
        boardHeight = 462;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'black';
  ctx.strokeRect(boardPositionX, boardPositionY, boardWidth, boardHeight);
}

function DrawInfo(canvas) {
  tetrisLogo = new Image(161, 54);
  tetrisLogo.src = "tetrislogo.png";
  tetrisLogo.onload = DrawTetrisLogo;

  ctx.fillStyle = 'black';
  ctx.font = '21px Arial';
  
  ctx.fillText("SCORE", 300, 98);
  ctx.strokeRect(300, 107, 161, 24);
  ctx.fillText(score.toString(), 310, 127);

  ctx.fillText("LEVEL", 300, 157);
  ctx.strokeRect(300, 171, 161, 24);
  ctx.fillText(level.toString(), 310, 190);

  ctx.fillText("WIN / LOSE", 300, 221);
  ctx.fillText(winOrLose, 310, 261);
  ctx.strokeRect(300, 232, 161, 95);

  ctx.fillText("CONTROLS", 300, 354);
  ctx.strokeRect(300, 366, 161, 104);

  ctx.font = '19px Arial';
  ctx.fillText("A: move left", 310, 388);
  ctx.fillText("D: move right", 310, 413);
  ctx.fillText("S: move down", 310, 438);
  ctx.fillText("E: rotate", 310, 463);
}

function DrawTetrisLogo() {
  ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
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

function HittingTheWall() {
  for (let i = 0; i < curTetromino.length; i++) {
      let newX = curTetromino[i][0] + startX;

      if (newX <= 0 && direction === DIRECTION.LEFT) {
        return true;
      } else if (newX >= 11 && direction == DIRECTION.RIGHT) {
        return true;
      }
  }

  return false;
}

function HandleKeyPress(key) {
  if (key.keyCode === 65) {
    direction = DIRECTION.LEFT;
    if (!HittingTheWall()) {
      DeleteTetromino();
      startX--;
      DrawTetromino();
    }
  } else if (key.keyCode === 68) {
    direction = DIRECTION.RIGHT;
    if (!HittingTheWall()) {
      DeleteTetromino();
      startX++;
      DrawTetromino();
    }
  } else if (key.keyCode === 83) {
    direction = DIRECTION.DOWN;
    DeleteTetromino();
    startY++;
    DrawTetromino();
  }
}