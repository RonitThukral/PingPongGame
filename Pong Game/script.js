let button = document.getElementById("button"); //to target start button
let gameBox = document.getElementById("gamebox"); // to target game box div
let userPaddle = document.getElementById("userpaddle"); // to target user paddle
let aiPaddle = document.getElementById("aipaddle"); // to target computer paddle
let ball = document.getElementById("ball"); // to target ball
let aiScore = document.getElementById("aiscore"); // to target computer score
let userScore = document.getElementById("userscore"); // to target user score
let wPressed = false;
let xPressed = false;
let timerElement = document.getElementById("timer"); // to target the countdown timer
let maxScore = document.getElementById("score"); // to target the max score

// for the click events
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
button.addEventListener("click", handleOnClick);

// key down function handeler that is when the key is pressed
function keyDownHandler(e) {
  if (e.key === "w") {
    wPressed = true;
    // console.log("w pressed")
  } else if (e.key === "x") {
    xPressed = true;
    // console.log("x pressed")
  }
}

// key up event handler that is when the key is released
function keyUpHandler(e) {
  if (e.key === "w") {
    wPressed = false;
    // console.log("w released")
  } else if (e.key === "x") {
    xPressed = false;
    // console.log("x released")
  }
}

//In this game i have used some logic of mathamatics and physics
// the concept of vectors is used.
// Vx here is the velocity of the ball in with the x axis and Vy is the velocityy of the ball with the y axis and V is the resultant of the Vx and Vy which is calculated using pythogoras theoram
let Vx = -4;
let Vy = -5;
let V = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2)); // By Pythogoras Theoram
// console.log(V);

// This is the reset function to reset the game if the ball goes out of the boundary
function reset() {
  ball.style.top = "50%";
  ball.style.left = "50%";
  Vx = -4;
  Vy = -5;
  V = Math.sqrt(Math.pow(Vx, 2) + Math.pow(Vy, 2));
  // userPaddle.style.top = "50%";
}

//this is the function to handle the start button click event
function handleOnClick() {
  // this is the alert which will be shown when some one clicks on the start button
  alert("game started");
  // this will make the start button disappear when once clicked
  button.style.display = "none";
  reset();

  var timerDuration = 5 * 60;
  startTimer(timerDuration);
}

// This is the function for the countdown timer tha will be shown when the game starts
function startTimer(duration) {
  var startTime = Date.now();
  var endTime = startTime + duration * 1000;

  var timerId = setInterval(function () {
    var currentTime = Date.now();
    var remainingTime = Math.max(0, endTime - currentTime);

    var minutes = Math.floor(remainingTime / 1000 / 60);
    var seconds = Math.floor((remainingTime / 1000) % 60);

    timerElement.textContext =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    timerElement.innerHTML = timerElement.textContext;
    if (remainingTime <= 0) {
      clearInterval(timerId);
      // timerElement.textContext = "Time's up!";
      // timerElement.innerHTML = timerElement.textContext;

      let user = Number(userScore.innerHTML);
      // console.log(user)
      let comp = Number(aiScore.innerHTML);
      // console.log(comp);
      // thi sis to display results who won and who lost
      if (user > comp) {
        timerElement.innerHTML = "Time's Up! YOU WON!";
      } else if (user < comp) {
        timerElement.innerHTML = "Time's Up! YOU LOST!";
      } else {
        timerElement.innerHTML = "Oh! It's a TIE";
      }

      button.style.display = "block";
      // this is to show the max score of the user player
      if (user > maxScore.innerHTML) {
        maxScore.innerHTML = user;
      }

      // this will reinitializde the score to 0 once the round is cpmplete
      userScore.innerHTML = "0";
      aiScore.innerHTML = "0";
    }
  }, 1000);
}

//function to check weather the collision happened between ball and any of the paddles
function checkCollision(activePaddle) {
  let ballTop = ball.offsetTop;
  let ballBottom = ball.offsetTop + ball.offsetHeight;
  let ballLeft = ball.offsetLeft;
  let ballRight = ball.offsetLeft + ball.offsetWidth;

  let paddleTop = activePaddle.offsetTop - 50;
  let paddleBottom = activePaddle.offsetTop + activePaddle.offsetHeight - 50;
  let paddleLeft = activePaddle.offsetLeft;
  let paddleRight = activePaddle.offsetLeft + activePaddle.offsetWidth;

  if (
    ballBottom >= paddleTop &&
    ballTop <= paddleBottom &&
    ballRight >= paddleLeft &&
    ballLeft <= paddleRight
  ) {
    // console.log("collision detected");
    return true;
  } else {
    // console.log(false);
    return false;
  }
}

// this  is the main game loop which will run infinite times
function gameLoop() {
  // this is if the ball is out of the left boundry that is the user side
  if (ball.offsetLeft < 0) {
    if (button.style.display === "none") {
      aiScore.innerHTML = parseInt(aiScore.innerHTML) + 1;
      reset();
    } else {
      Vx = -Vx;
    }
  }
  // this is to know if the ball is out of the right boundry that is the computer side
  if (ball.offsetLeft > gameBox.offsetWidth - ball.offsetWidth) {
    if (button.style.display === "none") {
      userScore.innerHTML = parseInt(userScore.innerHTML) + 1;
      reset();
    } else {
      Vx = -Vx;
    }
  }
  // this will bounce the ball back if it collides with top and the bottom of the game box
  if (ball.offsetTop < 0) {
    Vy = -Vy;
  }
  if (ball.offsetTop > gameBox.offsetHeight - ball.offsetHeight - 15) {
    Vy = -Vy;
  }

  // this is for to calculate which paddle the has or is going to hit
  let paddle =
    ball.offsetLeft < gameBox.offsetWidth / 2 ? userPaddle : aiPaddle;

  // this will calculate the measurement center of the ball from the top of the game box
  let ballcenterY = ball.offsetTop + ball.offsetHeight / 2;
  // console.log(ballcenterY);
  // this will calculate the measuremebt of the center of the paddle from the top of the game box
  let paddlecenterY = paddle.offsetTop + paddle.offsetHeight / 2;
  // console.log(paddlecenterY);

  // this is to clauculate the angle of teh ball resultant
  let angle = 0;

  // this is to get the angle of the ball after the collision
  if (checkCollision(paddle)) {
    if (paddle == userPaddle) {
      //  console.log("user paddle collision")
      if (ballcenterY < paddlecenterY) {
        // console.log("paddle top is hit")
        angle = -Math.PI / 4;
      } else if (ballcenterY > paddlecenterY) {
        // console.log("paddle bottom is hit")
        angle = Math.PI / 4;
      } else {
        angle = 0;
      }
    } else if (paddle === aiPaddle) {
      // console.log("ai paddle collision")
      if (ballcenterY < paddlecenterY) {
        // console.log("ai paddle top is hit")
        angle = (-3 * Math.PI) / 4;
      } else if (ballcenterY > paddlecenterY) {
        // console.log("ai paddle bottom is hit")
        angle = (3 * Math.PI) / 4;
      } else {
        angle = 0;
      }
    }
    V = V + 0.2; // this will increase the speed of the ball
    Vx = V * Math.cos(angle); //this is to calculate the resultant angle with respect to the x axis
    Vy = V * Math.sin(angle); // this is to calculate the resultant angle woith respect to the y axis
  }

  // this logic is for the computer paddle movement
  let aidelay = 0.3;
  aiPaddle.style.top =
    aiPaddle.offsetTop +
    (ball.offsetTop - aiPaddle.offsetTop - aiPaddle.offsetHeight / 2) *
      aidelay +
    5 +
    "px";

  // this is the logic for the ball movement with vx and vy
  ball.style.left = ball.offsetLeft + Vx + "px";
  ball.style.top = ball.offsetTop + Vy + "px";

  // this is the logic for w pressed and x pressed
  if (wPressed && userPaddle.offsetTop > 55) {
    userPaddle.style.top = userPaddle.offsetTop - 5 + "px";
  }
  if (
    xPressed &&
    userPaddle.offsetTop < gameBox.offsetHeight - userPaddle.offsetHeight + 40
  ) {
    userPaddle.style.top = userPaddle.offsetTop + 5 + "px";
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();
