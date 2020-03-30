let gamePiece = null;
let enemies = [];
let food = [];
let score = null;
let popup = null;

const GamePlatform = {
  canvas : document.createElement("canvas"),
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updatePlatform, 30);
    window.addEventListener('keydown', function(e) {
      GamePlatform.keys = (GamePlatform.keys|| [] );
      GamePlatform.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function(e) {
      GamePlatform.keys[e.keyCode] = false;
      gamePiece.stopMove();
    })
    window.addEventListener('touchmove',function(e) {
      GamePlatform.x = e.touches[0].screenX;
      GamePlatform.y = e.touches[0].screenY;
    })
  },
  clear: function() {
    this.context.clearRect(0,0 , this.canvas.width, this.canvas.height)
  },
  stop: function() {
    clearInterval(this.interval);
  }
};



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
    let ctx = GamePlatform.context;
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

  updatePos () {
    this.x += this.velocityX;
    this.y += this.velocityY;
  };

  hasCollidedWith (otherobj) {
    let left = this.x;
    let right = this.x + (this.width);
    let top = this.y;
    let bottom = this.y + (this.height);

    let otherLeft = otherobj.x;
    let otherRight = otherobj.x + (otherobj.width);
    let othertop = otherobj.y;
    let otherbottom = otherobj.y + otherobj.height;
    let crash = true;
    if (bottom < othertop ||
      top > otherbottom ||
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
  if ((GamePlatform.frameNo / n) % 1 == 0) return true;
  return false;
}

function updatePlatform() {
  let x = null;
  let y = null;

  for (let i = 0; i < enemies.length; i++) {

    if (gamePiece.hasCollidedWith(enemies[i])) {
      GamePlatform.stop();
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

      GamePlatform.frameNo += 100;
      setTimeout(function () {
        popup.text = "";
      }, 2000)
    }
  }

  if (GamePlatform.x && GamePlatform.y) {
    gamePiece.x = GamePlatform.x;
    gamePiece.y = GamePlatform.y;
  }

  GamePlatform.clear();
  GamePlatform.frameNo++;

  if (GamePlatform.frameNo == 1 || isInterval(50)) {
    x = GamePlatform.canvas.width;
    y = GamePlatform.canvas.height - 200;
    let maxHeight = GamePlatform.canvas.height - 10;
    let minHeight = 10;

    enemies.push(new GameComponent(10, 10, "#679b9b", x, Math.floor((Math.random() * maxHeight) + minHeight)));
    food.push(new GameComponent(10, 10, "#f8fab8", x, Math.floor((Math.random() * maxHeight) + minHeight)))
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x -= Math.random() + 0.8;
    enemies[i].render();
  }

  for (let i = 0; i < food.length; i++) {
    food[i].x -= Math.random() + 1;
    food[i].render()
  }

  if (GamePlatform.keys && GamePlatform.keys[37]) {
    gamePiece.moveLeft();
  }
  if (GamePlatform.keys && GamePlatform.keys[39]) {
    gamePiece.moveRight();
  }
  if (GamePlatform.keys && GamePlatform.keys[38]) {
    gamePiece.moveUp();
  }
  if (GamePlatform.keys && GamePlatform.keys[40]) {
    gamePiece.moveDown();
  }

  score.text = "SCORE: " + GamePlatform.frameNo;
  score.render();
  if (popup) {
    popup.render();
  }
  gamePiece.updatePos();
  gamePiece.render();
}



function startGame() {
  gamePiece = new GameComponent(30, 30, "#f76a8c", 10, 120);
  score = new GameComponent("14px", "Open Sans", "#679b9b", 10, 20, "text");
  popup = new GameComponent("12px", "Lato", "#fcf8f3", 100, 80, "popup");
  popup.text = "";
  GamePlatform.start();
}

let bgColors = ["#ffb6b6", "#ccf0e1", "#f8dc88", "#fcf8f3", "#d4ebd0", "#856c8b", "#a4c5c6", "#faf4ff"]
let bgIndex = 0;
setInterval(function () {
  document.body.style.cssText = "background-color: " + bgColors[bgIndex++];
  if (!bgIndex || bgIndex >= bgColors.length) {
    bgIndex = 0;
  }
}, 1000);
