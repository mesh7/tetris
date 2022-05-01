document.addEventListener("DOMContentLoaded", () => {
  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start-button");
  const grid = document.querySelector(".grid");
  let sqaures = Array.from(document.querySelectorAll(".grid div"));
  const width = 10;

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
  let current = theTetrominoes[1][1];
  console.log(random);

  //draw the tetromino
  function draw() {
    current.forEach((index) => {
      sqaures[currentPosition + index].classList.add("tetromino");
    });
  }

  //undraw the tetromino
  function undraw() {
    current.forEach((index) => {
      sqaures[currentPosition + index].classList.remove("tetromino");
    });
  }

  //move the tetromino move
  timerId = setInterval(moveDown, 1000);

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
        sqaures[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        sqaures[currentPosition + index].classList.add("taken")
      );

      //start random tatromino
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }
});
