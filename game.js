let gamePiece = null;
let enemies = [];
let food = [];
let score = null;
let popup = null;
let gamePlatform = null;

class GamePlatForm {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.keys = [];
    this.frameNo = 0;

  }
  start() {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // todo: make setinterval this reference calling object instead of window
    this.interval = setInterval(this.update, 25);
    this.setListeners();
    this.x = 0;
    this.y = 0;
  }

  setListeners() {
    window.addEventListener('keydown', function (e) {
      this.keys = (this.keys || []);
      this.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
      this.keys[e.keyCode] = false;
      gamePiece.stopMove();
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  stop() {
    clearInterval(this.interval);
  }

  update() {
    for (let i = 0; i < enemies.length; i++) {

      if (gamePiece.hasCollidedWith(enemies[i])) {
        gamePlatform.stop();
        //alert("<= Game Reborn =>")
        return;
      }

    }

    for (let i = 0; i < food.length; i++) {
      if (gamePiece.hasCollidedWith(food[i])) {
        popup.x = food[i].x + 15;
        popup.y = food[i].y + 10;
        food.splice(i, 1);
        popup.text = "+ Bonus:" + "100";

        gamePlatform.frameNo += 100;
        setTimeout(function () {
          popup.text = "";
        }, 2000)
      }
    }

    if (gamePlatform.x && gamePlatform.y) {
      gamePiece.x = gamePlatform.x;
      gamePiece.y = gamePlatform.y;
    }

    gamePlatform.clear();
    gamePlatform.frameNo++;

    if (gamePlatform.frameNo == 1 || isInterval(50)) {
      let newComponentX = gamePlatform.canvas.width;
      let maxHeight = gamePlatform.canvas.height - 10;
      let minHeight = 10;

      enemies.push(new GameComponent(10, 10, "#679b9b", newComponentX, Math.floor((Math.random() * maxHeight) + minHeight)));
      food.push(new GameComponent(10, 10, "#f8fab8", newComponentX, Math.floor((Math.random() * maxHeight) + minHeight)))
    }

    for (let i = 0; i < enemies.length; i++) {
      enemies[i].x -= Math.random() + 2;
      enemies[i].render();
    }

    for (let i = 0; i < food.length; i++) {
      food[i].x -= Math.random() + 1;
      food[i].render()
    }

    if (this.keys && this.keys[37]) {
      gamePiece.moveLeft();
    }
    if (this.keys && this.keys[39]) {
      gamePiece.moveRight();
    }
    if (this.keys && this.keys[38]) {
      gamePiece.moveUp();
    }
    if (this.keys && this.keys[40]) {
      gamePiece.moveDown();
    }

    score.text = "SCORE: " + gamePlatform.frameNo;
    score.render();
    if (popup) {
      popup.render();
    }
    gamePiece.updatePos();
    gamePiece.render();
  }
}

class GameComponent {
  constructor(width, height, color, x, y, type) {
    this.color = color;
    this.type = type;
    this.width = width;
    this.height = height;
    this.velocityX = 0;
    this.velocityY = 0;
    this.x = x;
    this.y = y;
  }

  render() {
    let ctx = gamePlatform.context;
    if (this.type === "popup") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    } else if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = this.color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  updatePos() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  };

  hasCollidedWith(otherObj) {
    let left = this.x;
    let right = this.x + (this.width);
    let top = this.y;
    let bottom = this.y + (this.height);

    let otherLeft = otherObj.x;
    let otherRight = otherObj.x + (otherObj.width);
    let otherTop = otherObj.y;
    let otherBottom = otherObj.y + otherObj.height;
    let crash = true;
    if (bottom < otherTop ||
      top > otherBottom ||
      right < otherLeft ||
      left > otherRight) {
      crash = false;
    }
    return crash;
  }

  moveUp() {
    this.velocityY -= 0.5;
  }

  moveDown() {
    this.velocityY += 0.5;
  }

  moveLeft() {
    this.velocityX -= 0.5;
  }

  moveRight() {
    this.velocityX += 0.5;
  }

  stopMove() {
    this.velocityX = 0;
    this.velocityY = 0;
  }
}

function isInterval(n) {
  if ((gamePlatform.frameNo / n) % 1 == 0) return true;
  return false;
}


function startGame() {
  gamePlatform = new GamePlatForm();
  gamePiece = new GameComponent(30, 30, "#f76a8c", 10, 120);
  score = new GameComponent("14px", "Open Sans", "#679b9b", 10, 20, "text");
  popup = new GameComponent("12px", "Lato", "#fcf8f3", 100, 80, "popup");
  popup.text = "";
  gamePlatform.start();
}

let bgColors = ["#ffb6b6", "#ccf0e1", "#f8dc88", "#fcf8f3", "#d4ebd0", "#856c8b", "#a4c5c6", "#faf4ff"]
let bgIndex = 0;
setInterval(function () {
  document.body.style.cssText = "background-color: " + bgColors[bgIndex++];
  if (!bgIndex || bgIndex >= bgColors.length) {
    bgIndex = 0;
  }
}, 1000);
