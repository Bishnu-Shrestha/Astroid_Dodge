let gameInterval;
let asteroidInterval;
let coinInterval;
let isPlaying = false;
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const score = document.getElementById("scoreVal");
const ship = document.getElementById("ship");
const area = document.querySelector(".area");
const enemy = document.getElementById("enemy");
const msgOverlay = document.getElementById("msgOverlay");

const message = document.createElement("div");
message.className = "message";
const moveAmount = 10;

// Function to check screen size and display a message
function checkScreenSize() {
  const minWidth = 800; // Minimum width for the game to be playable
  const minHeight = 600; // Minimum height for the game to be playable

  if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
    const msgText =
      "😓😓 Sorry!! 😓😓 this game is currently only compatible with PC's. I'm working on the mobile and tablet versions though,😅😅 for now if you can try and visit here through your PC.  <br /> This is just a simple old schoole gaem where you can controll a spaceship to evade astroids and collect coins.";
    MsgCreate(msgText, "50%");
  } else {
    msgOverlay.style.display = "none";
  }
}

// Call the function to check screen size on page load
document.addEventListener("DOMContentLoaded", checkScreenSize);

// Optionally, check screen size on window resize
window.addEventListener("resize", checkScreenSize);

function MsgCreate(msgCnt, sizeVal) {
  message.style.width = `${sizeVal}`;
  message.innerHTML = `${msgCnt}`;
  msgOverlay.appendChild(message);
  msgOverlay.style.display = "block";
}

function closeNav() {
  document.getElementById("msgOverlay").style.display = "none";
}
function startGame() {
  msgOverlay.style.display = "none";
  isPlaying = true;
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
    document.getElementById("closebtn").click();
  }
});
function play() {
  if (!isPlaying) {
    startGame();
  }
}
//how to play button.
document.getElementById("pause").addEventListener("click", () => {
  if (isPlaying) {
    isPlaying = false;
    clearInterval(asteroidInterval);
    clearInterval(coinInterval);
    document.removeEventListener("keydown", characterControl);
    document.querySelector(".area").classList.add("paused");
    const msgPaused = `Enjoying the Game so far? <br>Let me know! <br><br>GAME PAUSED <br> High Score:${Number(
      document.getElementById("hiScorVal").textContent
    )} <br>Current Score: ${Number(score.textContent)}.<br>
    <button onclick="closeNav(play()) ">Unpause and exit</button>`;
    const sizW = "25%";
    MsgCreate(msgPaused, sizW);
    document.querySelectorAll(".asteroids, .coins").forEach((element) => {
      element.classList.add("paused");
    });
  }
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
  asteroidImg.src = "./images/asteroid.png"; // Set the source of the image
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
  coinImg.src = "./images/coin.png"; // Set the source of the image
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
      const msgOver = `Let me know if you are facing any problems and further features if you want one.<br><br>!!!!GAME OVER!!!! <br><br> Your score: ${Number(
        score.textContent
      )}.`;
      const sizW = "25%";
      MsgCreate(msgOver, sizW);
      resetGame();
    }
  });

  // Collision checking for coins
  document.querySelectorAll(".coins").forEach((coin) => {
    const coinRect = coin.getBoundingClientRect();

    if (
      shipRect.left < coinRect.left + coinRect.width &&
      shipRect.left + shipRect.width > coinRect.left &&
      shipRect.top < coinRect.top + coinRect.height &&
      shipRect.top + shipRect.height > coinRect.top
    ) {
      // Collision detected with coin
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
  ship.innerHTML = "<img src='./images/spaceship.png' width='100px' />";
});

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
    a: { axis: "x", value: -speed, img: "./images/spaceship_rev.png" },
    d: { axis: "x", value: speed, img: "./images/spaceship_fwd.png" },
    arrowup: { axis: "y", value: -speed },
    arrowdown: { axis: "y", value: speed },
    arrowleft: { axis: "x", value: -speed, img: "./images/spaceship_rev.png" },
    arrowright: { axis: "x", value: speed, img: "./images/spaceship_fwd.png" },
  };

  let key = event.key.toLowerCase();
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
  clearInterval(asteroidInterval);
  clearInterval(coinInterval);
  document.removeEventListener("keydown", characterControl);
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.remove();
  });
  hiScoreCalc(Number(score.textContent));
  score.textContent = "0";
  ship.innerHTML = "<img src='./images/spaceship.png' width='100px'/>";
  ship.style.top = "50%";
  ship.style.left = "50%";
}

document.getElementById("instructions").addEventListener("click", () => {
  alert(
    "Use W, A, S, D keys or the arrow keys to move the spaceship. Avoid asteroids and collect blue coins and power-ups."
  );
});

function exit() {
  game.style.display = "none";
  menu.style.display = "block";
  isPlaying = false;
  clearInterval(asteroidInterval);
  clearInterval(coinInterval);
  document.removeEventListener("keydown", characterControl);
  document.querySelector(".area").classList.add("paused");
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.classList.add("paused");
    element.remove();
  });
}
