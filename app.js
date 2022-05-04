document.addEventListener("DOMContentLoaded", () => {
  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button");
  const increaseButton = document.querySelector("#increase-button");
  const decreaseButton = document.querySelector("#decrease-button");

  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let gameEnded = false;

  //Tetrominoes
  //L/Z/T/O/I
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select the tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //draw the tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
    });
  }

  //undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
    });
  }

  //function to catch keypress events
  function keyControl(e) {
    if (!gameEnded) {
      if (e.keyCode === 37) {
        moveLeft();
      } else if (e.keyCode === 38) {
        rotate();
      } else if (e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 40) {
        moveDown();
      }
    }
  }

  document.addEventListener("keyup", keyControl);

  //move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze tetromino
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //start random tatromino
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  //move tetromino left, unless there's blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }
    if (
      current.some(
        (index) => squares[currentPosition + index].classList.contains["taken"]
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move tetromino right, unless there's blockage
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) {
      currentPosition += 1;
    }
    if (
      current.some(
        (index) => squares[currentPosition + index].classList.contains["taken"]
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  //rotate tetromino
  function rotate() {
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    console.log(isAtRightEdge);
    if (!isAtLeftEdge || !isAtRightEdge) {
      undraw();
      currentRotation++;
      if (currentRotation === current.length) {
        currentRotation = 0;
      }
      current = theTetrominoes[random][currentRotation];
    }
    draw();
  }

  //show up-next tetromino
  const displaySqaures = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  //the tetromino without rotations
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  //display the shape in the mini-grid
  function displayShape() {
    displaySqaures.forEach((square) => {
      square.classList.remove("tetromino");
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySqaures[displayIndex + index].classList.add("tetromino");
    });
  }

  //start and pause the game
  startButton.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
        });
        const sqauresRemoved = squares.splice(i, width);
        squares = sqauresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "END";
      clearInterval(timerId);
      //setting boolean to true and using it as validation to stop the keyup functionality
      gameEnded = true;
    }
  }
});
