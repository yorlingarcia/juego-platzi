const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementsSize;

let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;
let recordTime;

let auxTime = undefined;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let enemyPositions = [];

const doorPosition = {
  x: undefined,
  y: undefined,
};

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementsSize = canvasSize / 10;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function startGame() {
  //console.log({ canvasSize, elementsSize });

  game.font = elementsSize + "px Verdana";
  game.textAlign = "end";
  const map = maps[level];

  if (!map) {
    console.log("Terminaste el juego");
    recordTime = localStorage.getItem("record_time");
    timePlayer = Date.now() - timeStart;

    if (recordTime) {
      if (recordTime >= timePlayer) {
        localStorage.setItem("record_time", timePlayer);
        pResult.innerHTML = "Superaste el record";
      } else {
        pResult.innerHTML = "No superaste el record";
      }
    } else {
      localStorage.setItem("record_time", timePlayer);
    }
    clearInterval(timeInterval);
    auxTime = true;
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  const mapRows = map.trim().split("\n");
  const mapRowCols = mapRows.map((row) => row.trim().split(""));
  console.log({ map, mapRows, mapRowCols });

  game.clearRect(0, 0, canvasSize, canvasSize);
  enemyPositions = [];

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == "O") {
        doorPosition.x = posX;
        doorPosition.y = posY;
        console.log({ doorPosition });
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({ playerPosition });
        }
      }
      if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
        console.log({ giftPosition });
      }
      if (col == "X") {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      game.fillText(emoji, posX, posY);
    });
  });

  movePlayer();
  showLives();
}

function movePlayer() {
  console.log({ giftPosition, playerPosition });
  const enemyCollision = enemyPositions.find((enemy) =>
    enemy.x.toFixed(3) == playerPosition.x.toFixed(3) &&
    enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
      ? true
      : false
  );
  if (enemyCollision) {
    console.log("chocaste", lives);
    playerPosition.x = doorPosition.x;
    playerPosition.y = doorPosition.y;
    if (lives > 1) {
      lives--;
    } else {
      console.log("Perdiste");
      level = 0;
      lives = 3;
      playerPosition.x = undefined;
      playerPosition.y = undefined;
      timeStart = undefined;
      startGame();
    }
  }
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
  if (
    playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3) &&
    playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3)
  ) {
    level++;
    console.log("subiste de nivel");
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
  }
}

function showLives() {
  spanLives.innerHTML = emojis["HEART"].repeat(lives);
}

function showTime() {
  if (auxTime) {
    // condicion necesario para obligar al sistema a detener el contador(solucion temporal)
    clearInterval(timeInterval);
  } else {
    spanTime.innerHTML = Date.now() - timeStart;
  }
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
}

window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(event) {
  if (event.key == "ArrowUp") moveUp();
  else if (event.key == "ArrowLeft") moveLeft();
  else if (event.key == "ArrowRight") moveRight();
  else if (event.key == "ArrowDown") moveDown();
}
function moveUp() {
  console.log("Me quiero mover hacia arriba");

  if (playerPosition.y <= elementsSize) {
    console.log("Out");
  } else {
    playerPosition.y -= elementsSize;
  }
  startGame();
}
function moveLeft() {
  console.log("Me quiero mover hacia izquierda");
  if (playerPosition.x <= elementsSize) {
    console.log("Out");
  } else {
    playerPosition.x -= elementsSize;
  }
  startGame();
}
function moveRight() {
  console.log("Me quiero mover hacia derecha");
  if (playerPosition.x >= canvasSize) {
    console.log("Out");
  } else {
    playerPosition.x += elementsSize;
  }

  startGame();
}
function moveDown() {
  console.log("Me quiero mover hacia abajo");
  if (playerPosition.y >= canvasSize) {
    console.log("Out");
  } else {
    playerPosition.y += elementsSize;
  }
  startGame();
}
