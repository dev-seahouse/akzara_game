class GamePlatForm {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;
    this.playerComponent = new GameComponent(30, 30, "#f76a8c", 10, 120);
    this.scoreTextComponent = new GameComponent("14px", "Open Sans", "#679b9b", 10, 20, "text");
    this.enemyComponents = [];
    this.bonusScoreComponent = [];
    this.popupComponent = new GameComponent("12px", "Lato", "#fcf8f3", 100, 80, "popup");
  }

  start() {
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    // todo: make setinterval this reference calling object instead of window
    this.interval = setInterval(this.render.bind(this), 25);
    this.setListeners();
    this.x = 0;
    this.y = 0;
    this.popupComponent.text = "";
  }

  setListeners() {
    const _this = this;
    window.addEventListener('keydown', function (e) {
      _this.keys = (_this.keys || []);
      _this.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
      _this.keys[e.keyCode] = false;
      _this.playerComponent.stopMove();
    });
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  stop() {
    clearInterval(this.interval);
  }

  render() {
    this.frameNo++;
    this.handleCollidedWithEnemies();
    this.handleCollidedWithBonus();
    this.clear();
    this.createComponentsPerInterval(50);
    this.generateEnemies();
    this.generateFood();
    this.movePlayerToNewPosition();
    this.scoreTextComponent.text = "SCORE: " + this.frameNo;
    this.scoreTextComponent.render(this);
    if (this.popupComponent) {this.popupComponent.render(this);}
    this.playerComponent.updatePos();
    this.playerComponent.render(this);
  }

  createComponentsPerInterval(n) {
    if (this.frameNo === 1 || this.isInterval(50)) {
      let newComponentX = this.canvas.width;
      let maxHeight = this.canvas.height - 10;
      let minHeight = 10;

      this.enemyComponents.push(new GameComponent(10, 10, "#679b9b", newComponentX, Math.floor((Math.random() * maxHeight) + minHeight)));
      this.bonusScoreComponent.push(new GameComponent(10, 10, "#f8fab8", newComponentX, Math.floor((Math.random() * maxHeight) + minHeight)))
    }
  }

  handleCollidedWithBonus() {
    let _this = this;
    for (let i = 0; i < this.bonusScoreComponent.length; i++) {
      if (this.playerComponent.hasCollidedWith(this.bonusScoreComponent[i])) {
        this.popupComponent.x = this.bonusScoreComponent[i].x + 15;
        this.popupComponent.y = this.bonusScoreComponent[i].y + 10;
        this.bonusScoreComponent.splice(i, 1);
        this.popupComponent.text = "+ Bonus:" + "100";
        this.frameNo += 100;
        setTimeout(function () {
          _this.popupComponent.text = "";
        }, 2000)
      }
    }
  }

  handleCollidedWithEnemies() {
    for (let i = 0; i < this.enemyComponents.length; i++) {
      if (this.playerComponent.hasCollidedWith(this.enemyComponents[i])) {
        this.stop();
        alert("<= It is not a game over. It is a fresh beginning. =>");
      }
    }
  }

  movePlayerToNewPosition() {
    if (this.keys && this.keys[37]) {
      this.playerComponent.moveLeft();
    }
    if (this.keys && this.keys[39]) {
      this.playerComponent.moveRight();
    }
    if (this.keys && this.keys[38]) {
      this.playerComponent.moveUp();
    }
    if (this.keys && this.keys[40]) {
      this.playerComponent.moveDown();
    }
  }

  generateFood() {
    for (let i = 0; i < this.bonusScoreComponent.length; i++) {
      this.bonusScoreComponent[i].x -= Math.random() + 1;
      this.bonusScoreComponent[i].render(this)
    }
  }

  generateEnemies() {
    for (let i = 0; i < this.enemyComponents.length; i++) {
      this.enemyComponents[i].x -= Math.random() + 2;
      this.enemyComponents[i].render(this);
    }
  }

  isInterval(n) {
    return (this.frameNo / n) % 1 === 0;
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

  render(gamePlatform) {
    let ctx = gamePlatform.context;
    if (this.type === "popup" || this.type === "text") {
     this.setText(ctx);
    } else {
      this.drawRect(ctx);
    }
  }

  drawRect(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  setText(ctx) {
    ctx.font = this.width + " " + this.height;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
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
    return !(bottom < otherTop || top > otherBottom || right < otherLeft || left > otherRight);
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

