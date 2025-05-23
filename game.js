const menu = document.getElementById("menu");
const game = document.getElementById("game");
const score = document.getElementById("scoreVal");
const ship = document.getElementById("ship");
const area = document.querySelector(".area");
const bgAudio = new Audio("./Assets/bgAudio.wav");
const enemy = document.getElementById("enemy");
const msgOverlay = document.getElementById("msgOverlay");
const message = document.createElement("div");
message.className = "message";
const moveAmount = 10;
let gameInterval;
let asteroidInterval;
let coinInterval;
let isPlaying = false;
// Function to check screen size and display a message
// function checkScreenSize() {
//   const minWidth = 800; // Minimum width for the game to be playable
//   const minHeight = 600; // Minimum height for the game to be playable

//   if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
//     const msgText =
//       "If you are on mobile 😓😓 Sorry!! 😓😓 this game is currently only compatible with PC's with keyboard. I'm working on touch version for the mobile and tablet, 😅😅 for now if you can try and visit here through your PC.  <br /> This is just a simple old school game where you can control a spaceship to evade asteroid's and collect coins.";
//     MsgCreate(msgText, "50%");
//   } else {
//     msgOverlay.style.display = "none";
//   }
// }

// Call the function to check screen size on page load
document.addEventListener("DOMContentLoaded", checkScreenSize);

// Optionally, check screen size on window resize
window.addEventListener("resize", checkScreenSize);

function MsgCreate(msgCnt, sizeVal) {
  message.style.width = `${sizeVal}`;
  message.innerHTML = `${msgCnt}`;
  const closeBtn = document.createElement("a");
  closeBtn.id = "closeBtn";
  closeBtn.href = "javascript:void(0)";
  closeBtn.innerHTML = "&times;";
  closeBtn.title = "Esc";
  closeBtn.onclick = function () {
    document.getElementById("msgOverlay").style.display = "none";
  };
  message.appendChild(closeBtn);
  msgOverlay.appendChild(message);
  msgOverlay.style.display = "block";
}

function startGame() {
  msgOverlay.style.display = "none";
  isPlaying = true;
  toggleBtn(isPlaying);
  //background music
  bgAudio.loop = true;
  const play = document.getElementById("play");
  play.classList.add("on");
  play.textContent = "Playing";
  gameLoop();
  asteroidInterval = setInterval(createAsteroid, 2000); // Generate an asteroid every 2 seconds
  coinInterval = setInterval(createCoins, 2000); // Generate a coin every 2 seconds
  document.addEventListener("keydown", characterControl);
  document.querySelector(".area").classList.remove("paused");
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.classList.remove("paused");
  });
}

function gameLoop() {
  if (!isPlaying) return;
  const shipRect = ship.getBoundingClientRect(); // Calculate once per frame
  checkCollisions(shipRect);
  requestAnimationFrame(gameLoop);
}

// Event listener to start the game
document.getElementById("startGame").addEventListener("click", () => {
  menu.style.display = "none";
  game.style.display = "block";
  startGame();
});
//adding key bindings for easier keyboard navigations
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.getElementById("play").click();
  }
  if (event.code === "Space") {
    document.getElementById("pause").click();
  }
  if (event.key === "Escape") {
    document.getElementById("closeBtn").click();
  }
});
function play() {
  if (!isPlaying) {
    toggleBtn(!isPlaying);
    startGame();
  }
}
function toggleBtn(isPlaying) {
  const pause = document.getElementById("pause");
  const play = document.getElementById("play");
  if (isPlaying) {
    play.classList.add("on");
    play.textContent = "Playing";
    pause.classList.remove("on");
    pause.textContent = "Pause";
    bgAudio.play();
  } else {
    play.classList.remove("on");
    play.textContent = "Play";
    pause.classList.add("on");
    pause.textContent = "Paused";
    bgAudio.pause();
  }
}
//pause button.
document.getElementById("pause").addEventListener("click", () => {
  if (isPlaying) {
    isPlaying = false;
    toggleBtn(isPlaying);
    clearInterval(asteroidInterval);
    clearInterval(coinInterval);
    document.removeEventListener("keydown", characterControl);
    document.querySelector(".area").classList.add("paused");

    document.querySelectorAll(".asteroids, .coins").forEach((element) => {
      element.classList.add("paused");
    });
  }
  const msgPaused = `Enjoying the Game so far? <br>Let me know! <br><br>GAME PAUSED <br> High Score: ${Number(
    document.getElementById("hiScorVal").textContent
  )} <br>Current Score: ${Number(score.textContent)}.<br><br>
    <button onclick="closeBtn(play()) ">Hide and Un Pause</button>`;
  const sizW = "25%";
  MsgCreate(msgPaused, sizW);
});

//spawn asteroids
function createAsteroid() {
  const areaHeight = area.clientHeight;
  const areaWidth = area.clientWidth;

  // Create a new asteroid div
  const asteroid = document.createElement("div");
  asteroid.className = "asteroids";
  asteroid.style.top = `${Math.floor(Math.random() * (areaHeight - 60))}px`; // Random vertical position within the area
  asteroid.style.left = `${areaWidth}px`; // Position at the right border

  // Create an img element inside the asteroid div
  const asteroidImg = document.createElement("img");
  asteroidImg.src = "./Assets/asteroid.png"; // Set the source of the image
  asteroidImg.width = 50; // Set the width of the image
  asteroidImg.height = 50; // Set the height of the image

  // Append the img element to the asteroid div
  asteroid.appendChild(asteroidImg);

  // Append the asteroid div to the game area
  area.appendChild(asteroid);

  // Remove the asteroid after the animation ends
  asteroid.addEventListener("animationend", () => {
    asteroid.remove();
  });
}

function createCoins() {
  const areaHeight = area.clientHeight;
  const areaWidth = area.clientWidth;

  // Create a new coin div
  const coin = document.createElement("div");
  coin.className = "coins";
  coin.style.top = `${Math.floor(Math.random() * (areaHeight - 70))}px`; // Random vertical position within the area
  coin.style.left = `${areaWidth}px`; // Position at the right border

  // Create an img element inside the coin div
  const coinImg = document.createElement("img");
  coinImg.src = "./Assets/coin.png"; // Set the source of the image
  coinImg.width = 20; // Set the width of the image
  coinImg.height = 20; // Set the height of the image

  // Append the img element to the coin div
  coin.appendChild(coinImg);

  // Append the coin div to the game area
  area.appendChild(coin);

  // Remove the coin after the animation ends
  coin.addEventListener("animationend", () => {
    coin.remove();
  });
}

function checkCollisions(shipRect) {
  const collisionMarginS = 10; // Adjust this value to reduce the collision box size

  const reducedShipRect = {
    left: shipRect.left + collisionMarginS,
    right: shipRect.right - collisionMarginS,
    top: shipRect.top + collisionMarginS,
    bottom: shipRect.bottom - collisionMarginS,
    width: shipRect.width - 2 * collisionMarginS,
    height: shipRect.height - 2 * collisionMarginS,
  };

  // Collision checking for asteroids
  document.querySelectorAll(".asteroids").forEach((asteroid) => {
    const asteroidRect = asteroid.getBoundingClientRect();
    const collisionMarginA = 5;
    const reducedAsteroidRect = {
      left: asteroidRect.left + collisionMarginA,
      right: asteroidRect.right - collisionMarginA,
      top: asteroidRect.top + collisionMarginA,
      bottom: asteroidRect.bottom - collisionMarginA,
      width: asteroidRect.width - 2 * collisionMarginA,
      height: asteroidRect.height - 2 * collisionMarginA,
    };

    if (
      reducedShipRect.left <
        reducedAsteroidRect.left + reducedAsteroidRect.width &&
      reducedShipRect.left + reducedShipRect.width > reducedAsteroidRect.left &&
      reducedShipRect.top <
        reducedAsteroidRect.top + reducedAsteroidRect.height &&
      reducedShipRect.top + reducedShipRect.height > reducedAsteroidRect.top
    ) {
      // Collision detected
      document.querySelectorAll(".asteroids, .coins").forEach((element) => {
        element.classList.add("paused");
      });
      const explosion = new Audio("Assets/explosion.wav");
      explosion.play();
      const hi = Number(document.getElementById("hiScorVal").textContent);
      const scored = Number(score.textContent);
      const msgOver =
        scored > hi
          ? `!!!!!!!!New High Score!!!!!!!! <br><br>Let me know if you are facing any problems and suggest a features if you want one. <br><br>!!!!GAME OVER!!!! <br><br>Presvious High Score: ${hi}<br>Your score: ${scored}.`
          : `Let me know if you are facing any problems and suggest a features if you want one. <br><br>!!!!GAME OVER!!!! <br><br> High Score: ${hi}<br>Your score: ${scored}.`;

      const sizW = "25%";

      MsgCreate(msgOver, sizW);
      resetGame();
    }
  });

  // Score calculation for coins colected
  document.querySelectorAll(".coins").forEach((coin) => {
    const coinRect = coin.getBoundingClientRect();

    if (
      shipRect.left < coinRect.left + coinRect.width &&
      shipRect.left + shipRect.width > coinRect.left &&
      shipRect.top < coinRect.top + coinRect.height &&
      shipRect.top + shipRect.height > coinRect.top
    ) {
      // Collision detected with coin
      const coinCollected = new Audio("./Assets/coinCollected.wav");
      coinCollected.play();

      coin.remove(); // Remove the coin from the game area

      let scoreValue = Number(score.textContent);
      scoreValue++;
      score.textContent = `${scoreValue}`;
    }
  });
}

// Keeping high score in check
// Initialize high score display
document.addEventListener("DOMContentLoaded", () => {
  const hiScore = localStorage.getItem("hiScore") || 0;
  document.getElementById("hiScorVal").textContent = hiScore;
});
function hiScoreCalc(scoreVal) {
  let hiScore = localStorage.getItem("hiScore") || 0;
  if (scoreVal > hiScore) {
    localStorage.setItem("hiScore", scoreVal);
    hiScore = scoreVal;
  }
  document.getElementById("hiScorVal").textContent = hiScore;
}

document.addEventListener("keyup", (event) => {
  ship.innerHTML = "<img src='./Assets/spaceship.png'  />";
});

document
  .getElementById("up")
  .addEventListener("touchstart", () => characterControl("ArrowUp"));
document
  .getElementById("down")
  .addEventListener("touchstart", () => characterControl("ArrowDown"));
document
  .getElementById("left")
  .addEventListener("touchstart", () => characterControl("ArrowLeft"));
document
  .getElementById("right")
  .addEventListener("touchstart", () => characterControl("ArrowRight"));

// Controlling the spaceship using the W, A, S, D keys
function characterControl(event) {
  const areaRect = area.getBoundingClientRect();
  const shipRect = ship.getBoundingClientRect();

  let y = ship.offsetTop;
  let x = ship.offsetLeft;

  const speed = moveAmount; // Movement speed

  // Movement key mapping
  const movementKeys = {
    w: { axis: "y", value: -speed },
    s: { axis: "y", value: speed },
    a: { axis: "x", value: -speed, img: "./Assets/spaceship_rev.png" },
    d: { axis: "x", value: speed, img: "./Assets/spaceship_fwd.png" },
    arrowup: { axis: "y", value: -speed },
    arrowdown: { axis: "y", value: speed },
    arrowleft: { axis: "x", value: -speed, img: "./Assets/spaceship_rev.png" },
    arrowright: { axis: "x", value: speed, img: "./Assets/spaceship_fwd.png" },
  };

  // Optional: Also allow desktop mouse clicks for testing

  let key;

  if (typeof event === "string") {
    key = event.toLowerCase();
  } else {
    key = event.key.toLowerCase();
  }
  if (movementKeys[key]) {
    let move = movementKeys[key];

    if (move.axis === "y") {
      y += move.value;
    } else {
      x += move.value;
      if (move.img) {
        ship.innerHTML = `<img src="${move.img}" width="100px" />`;
      }
    }

    // **Ensure the ship stays within the game area**
    y = Math.max(0, Math.min(y, areaRect.height - shipRect.height));
    x = Math.max(0, Math.min(x, areaRect.width - shipRect.width));

    ship.style.top = `${y}px`;
    ship.style.left = `${x}px`;
  }
}
// Add reset functionality
function resetGame() {
  // msgOverlay.style.display = "none";
  isPlaying = false;
  toggleBtn(isPlaying);
  clearInterval(asteroidInterval);
  clearInterval(coinInterval);
  document.removeEventListener("keydown", characterControl);
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.remove();
  });
  hiScoreCalc(Number(score.textContent));
  score.textContent = "0";
  ship.innerHTML = "<img src='./Assets/spaceship.png' />";
  ship.style.top = "50%";
  ship.style.left = "50%";
}

document.getElementById("instructions").addEventListener("click", () => {
  const instructions =
    "Use W, A, S, D keys or the arrow keys to move the spaceship. Avoid asteroids and collect blue coins and power-ups.";
  const sizeW = "30%";
  MsgCreate(instructions, sizeW);
});

function exit() {
  game.style.display = "none";
  menu.style.display = "block";
  isPlaying = false;
  bgAudio.pause();
  clearInterval(asteroidInterval);
  clearInterval(coinInterval);
  document.removeEventListener("keydown", characterControl);
  document.querySelector(".area").classList.add("paused");
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.classList.add("paused");
    element.remove();
  });
}
