// Press D to go right, Press A to go left, Press Space to jump
// You can jump and move at the same time


function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
    this.rightMove = false;
    this.leftMove = false;
    this.jumping = false;
    this.justRight = true;
    this.justLeft = false;
    this.rightScrolling = false;
    this.leftScrolling = false;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {

        if (this.isDone()) {
            this.elapsedTime = 0;
        }

    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}

BoundingBox.prototype.collide = function (oth) {
    if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) {
        return true;
    } else {
        return false;
    }
}

function PlayGame(game, x, y) {
    Entity.call(this, game, x, y);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.update = function () {
    if (this.game.click){
    	this.game.running = true;
    	hide(0, 2000, "dialogue");
    } 
}

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "300% sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        if (this.game.mouse) { ctx.fillStyle = "#ddd"; }
        if (!this.game.dead) {
        	ctx.fillText("click to begin", this.x, this.y);
        }
        else {
            ctx.fillText("try again", this.x, this.y);
        }
    }
}

function Background(game) {
     this.x = 0;
     this.y = 0;
     Entity.call(this, game, 0, 0);
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
	let canvas = document.getElementById("gameWorld");
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  if (this.game.running) {
    if (this.game.rightScroll) this.rightScrolling = true;
    if (this.game.leftScroll) this.leftScrolling = true;
    if (this.rightScrolling) {
      this.x -= 0.3;
      if (!this.game.rightScroll) {
        this.rightScrolling = false;
      }
    } else if (this.leftScrolling) {
      this.x += 0.3;
      if (!this.game.leftScroll) {
        this.leftScrolling = false;
      }
    }
    if (this.x > 700) this.x = 0;
    if (this.x < 0) this.x = 698;
  }

    Entity.prototype.update.call(this);
}

Background.prototype.draw = function (ctx) {
	let size = window.innerWidth;
	let fillNum = (size/700) + 2;
	let x = this.x - 699;
	let y = this.y;

	for (i = 0; i < fillNum; i++){
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0005.jpg"), x, y);
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), x, y);
		ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), x, y);
		x += 699;
	}

}

// the "main" code begins here
const gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/box1.png");
ASSET_MANAGER.queueDownload("./img/box2.png");
ASSET_MANAGER.queueDownload("./img/lizard.png");
ASSET_MANAGER.queueDownload("./img/lizard_right.png");
ASSET_MANAGER.queueDownload("./img/gwen_idle.png");
ASSET_MANAGER.queueDownload("./img/idle.png");
ASSET_MANAGER.queueDownload("./img/walk.png");
ASSET_MANAGER.queueDownload("./img/idle copy.png");
ASSET_MANAGER.queueDownload("./img/walk_left.png");
ASSET_MANAGER.queueDownload("./img/Image_0005.jpg");
ASSET_MANAGER.queueDownload("./img/Image_0009.png");
ASSET_MANAGER.queueDownload("./img/Image_0010.png");
ASSET_MANAGER.queueDownload("./img/woodplat.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var boxes = [];
    var bg = new Background(gameEngine);
    var box = new Box1(gameEngine, 400, 545, 144, 144);
    var box2 = new Box2(gameEngine, 544, 545, 144, 144);
    var box3 = new Box2(gameEngine, 230, 545, 144, 144);
    var plat = new Plat1(gameEngine, 150, 470, 545, 92);

    gameEngine.running = false;
    gameEngine.dead = false;

    gameEngine.addEntity(bg);
    gameEngine.addEntity(box);
    gameEngine.addEntity(box2);
    gameEngine.addEntity(box3);
    gameEngine.addEntity(plat);
    boxes.push(box);
    boxes.push(box2);
    boxes.push(box3);
  //  boxes.push(box4);
    boxes.push(plat);

    gameEngine.boxes = boxes;

    var unicorn = new Unicorn(gameEngine);
    var pg = new PlayGame(gameEngine, canvas.width/2, canvas.height/2);
    gameEngine.addEntity(unicorn);
    gameEngine.addEntity(pg);

    setText("THE MACHINE", "dialogue");
    display(1, "dialogue");

    gameEngine.init(ctx);
    gameEngine.start();
});
