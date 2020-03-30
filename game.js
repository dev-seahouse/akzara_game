let gamePiece = null;
let enemies = [];
let food = [];
let score = null;
let popup = null;
let gamePlatform = null;

class GamePlatForm {
  constructor(gamePiece) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    this.gamePiece = gamePiece;
  }
  start() {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // todo: make setinterval this reference calling object instead of window
    this.interval = setInterval(this.update.bind(this), 25);
    this.setListeners();
    this.x = 0;
    this.y = 0;
  }

  setListeners() {
    const _this = this;
    window.addEventListener('keydown', function (e) {
      window.keys = (window.keys || []);
      window.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
      window.keys[e.keyCode] = false;
      _this.gamePiece.stopMove();
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

      if (this.gamePiece.hasCollidedWith(enemies[i])) {
        this.stop();
        alert("<= It is not a game over. It is a fresh beginning. =>");
        return;
      }

    }

    for (let i = 0; i < food.length; i++) {
      if (this.gamePiece.hasCollidedWith(food[i])) {
        popup.x = food[i].x + 15;
        popup.y = food[i].y + 10;
        food.splice(i, 1);
        popup.text = "+ Bonus:" + "100";

        this.frameNo += 100;
        setTimeout(function () {
          popup.text = "";
        }, 2000)
      }
    }

    if (this.x && this.y) {
      this.gamePiece.x = this.x;
      this.gamePiece.y = this.y;
    }

    this.clear();
    this.frameNo++;

    if (this.frameNo == 1 || this.isInterval(50)) {
      let newComponentX = this.canvas.width;
      let maxHeight = this.canvas.height - 10;
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

    if (window.keys && window.keys[37]) {
      this.gamePiece.moveLeft();
    }
    if (window.keys && window.keys[39]) {
      this.gamePiece.moveRight();
    }
    if (window.keys && window.keys[38]) {
      this.gamePiece.moveUp();
    }
    if (window.keys && window.keys[40]) {
      this.gamePiece.moveDown();
    }

    score.text = "SCORE: " + this.frameNo;
    score.render();
    if (popup) {
      popup.render();
    }
    this.gamePiece.updatePos();
    this.gamePiece.render();
  }

  isInterval(n) {
    if ((this.frameNo / n) % 1 == 0) return true;
    return false;
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


function startGame() {
  gamePiece = new GameComponent(30, 30, "#f76a8c", 10, 120);
  gamePlatform = new GamePlatForm(gamePiece);
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
