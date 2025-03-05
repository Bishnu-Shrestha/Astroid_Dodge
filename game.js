const minX = 480; // left side
const maxX = 1355; // right side
const minY = 160; // top side
const maxY = 730; // bottom side

let gameInterval;
let asteroidInterval;
let coinInterval;
let isPlaying = false;
const score = document.getElementById("scoreVal");
const ship = document.getElementById("ship");
const enemy = document.getElementById("enemy");
const moveAmount = 10;

function startGame() {
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
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  startGame();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    document.getElementById("play").click();
  }
});

document.getElementById("play").addEventListener("click", () => {
  if (!isPlaying) {
    startGame();
  }
});

document.getElementById("pause").addEventListener("click", () => {
  if (isPlaying) {
    isPlaying = false;
    clearInterval(asteroidInterval);
    clearInterval(coinInterval);
    document.removeEventListener("keydown", characterControl);
    document.querySelector(".area").classList.add("paused");
    document.querySelectorAll(".asteroids, .coins").forEach((element) => {
      element.classList.add("paused");
    });
  }
});

//spawn asteroids
function createAsteroid() {
  // Create a new asteroid div
  const asteroid = document.createElement("div");
  asteroid.className = "asteroids";
  asteroid.style.top = `${
    Math.floor(Math.random() * (maxY - minY - 30)) + minY
  }px`;
  asteroid.style.left = `${maxX}px`;

  // Create an img element inside the asteroid div
  const asteroidImg = document.createElement("img");
  asteroidImg.src = "./images/asteroid.png"; // Set the source of the image
  asteroidImg.width = 50; // Set the width of the image
  asteroidImg.height = 50; // Set the height of the image

  // Append the img element to the asteroid div
  asteroid.appendChild(asteroidImg);

  // Append the asteroid div to the game area
  document.querySelector(".area").appendChild(asteroid);

  // Remove the asteroid after the animation ends
  asteroid.addEventListener("animationend", () => {
    asteroid.remove();
  });
}

function createCoins() {
  // Create a new coin div
  const coin = document.createElement("div");
  coin.className = "coins";
  coin.style.top = `${Math.floor(Math.random() * (maxY - minY - 10)) + minY}px`;
  coin.style.left = `${maxX}px`;

  // Create an img element inside the coin div
  const coinImg = document.createElement("img");
  coinImg.src = "./images/coin.png"; // Set the source of the image
  coinImg.width = 20; // Set the width of the image
  coinImg.height = 20; // Set the height of the image

  // Append the img element to the coin div
  coin.appendChild(coinImg);

  // Append the coin div to the game area
  document.querySelector(".area").appendChild(coin);

  // Remove the coin after the animation ends
  coin.addEventListener("animationend", () => {
    coin.remove();
  });
}

document.getElementById("reset").addEventListener("click", () => {
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.remove();
  });
  ship.style.top = "49%";
  ship.style.left = "49%";
  score.innerHTML = `0`;
});
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
  //colision checking for asteroid
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
      alert(
        "Collision detected!\n------------------------------------------------\n !!!!!!!!!!!!!!!! GAME OVER !!!!!!!!!!!!!!!!\n------------------------------------------------"
      );
      resetGame();
    }
  });
  //coins for gaining points
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
//keeping kigh score in check
function hiScoreCalc(scoreVal) {
  let HiScore = 0;
  if (scoreVal > HiScore) {
    const hiScore = document.getElementById("hiScorVal");
    hiScore.textContent = scoreVal;
  }
}
//add reset functionality
function resetGame() {
  isPlaying = false;
  clearInterval(asteroidInterval);
  clearInterval(coinInterval);
  document.removeEventListener("keydown", characterControl);
  document.querySelectorAll(".asteroids, .coins").forEach((element) => {
    element.remove();
  });
  hiScoreCalc(score.textContent);
  score.textContent = "0";
  ship.innerHTML = "<img src='../images/spaceship.png' width='100px'/>";
  ship.style.top = "49%";
  ship.style.left = "49%";
}

document.getElementById("instructions").addEventListener("click", () => {
  alert(
    "Use W, A, S, D keys or the arrow keys to move the spaceship. Avoid asteroids and collect blue coins and power-ups."
  );
});

document.querySelectorAll(".exit").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("game").style.display = "none";
    document.getElementById("menu").style.display = "block";
    isPlaying = false;
    clearInterval(asteroidInterval);
    clearInterval(coinInterval);
    document.removeEventListener("keydown", characterControl);
    document.querySelector(".area").classList.add("paused");
    document.querySelectorAll(".asteroids, .coins").forEach((element) => {
      element.classList.add("paused");
    });
  });
});

document.addEventListener("keyup", (event) => {
  ship.innerHTML = "<img src='./images/spaceship.png' width='100px' />";
});

// Controlling the spaceship using the W, A, S, D keys
function characterControl(event) {
  const rect = ship.getBoundingClientRect();
  let y = rect.top + window.scrollY;
  let x = rect.left + window.scrollX;

  if (
    event.key.startsWith("Arrow") ||
    ["w", "a", "s", "d"].includes(event.key.toLowerCase())
  ) {
    switch (event.key.toLowerCase()) {
      case "arrowup":
      case "w":
        y -= moveAmount;
        break;
      case "arrowdown":
      case "s":
        y += moveAmount;
        break;
      case "arrowleft":
      case "a":
        ship.innerHTML =
          "<img src='./images/spaceship_rev.png' width='100px' />";
        x -= moveAmount;
        break;
      case "arrowright":
      case "d":
        ship.innerHTML =
          "<img src='./images/spaceship_fwd.png' width='100px' />";
        x += moveAmount;
        break;
    }

    // Ensure the ship stays within the boundaries
    if (y < minY) {
      y = minY;
    } else if (y + ship.offsetHeight > maxY) {
      y = maxY - ship.offsetHeight;
    }

    if (x < minX) {
      x = minX;
    } else if (x + ship.offsetWidth > maxX) {
      x = maxX - ship.offsetWidth;
    }

    ship.style.top = `${y}px`;
    ship.style.left = `${x}px`;
  }
}
