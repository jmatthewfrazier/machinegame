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

function Background(game) {
     this.x = 0;
     this.y = 0;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0005.jpg"), this.x, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), this.x, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), this.x, this.y);

}

function Gwen(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/gwen_idle.png"), 0, 0, 116, 191, 0.1, 76, true, false);
    this.radius = 100;
    this.ground = 570;
    Entity.call(this, game, 500, 550);
}

Gwen.prototype = new Entity();
Gwen.prototype.constructor = Gwen;

Gwen.prototype.update = function () {
      this.x += .5;
      if (this.x > 800) this.x = -30;
      Entity.prototype.update.call(this);
}

Gwen.prototype.draw = function (ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .8);
      Entity.prototype.draw.call(this);
}

function Man(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/idle.png"), 0, 0, 187, 91, 0.1, 109, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/idle.png"), 0, 0, 187, 91, 0.1, 16, false, false);
    this.animationRev = new Animation(ASSET_MANAGER.getAsset("./img/idle copy.png"), 0, 0, 187, 91, 0.1, 105, true, false);
    this.walkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/walk.png"), 0, 0, 187, 91, 0.05, 16, true, false);
    this.jumpRevAnimation = new Animation(ASSET_MANAGER.getAsset("./img/idle copy.png"), 0, 0, 187, 91, 0.1, 16, false, false);
    this.walkRevAnimation = new Animation(ASSET_MANAGER.getAsset("./img/walk copy.png"), 0, 0, 187, 91, 0.05, 16, true, true);
    this.jumping = false;
    this.rightMove = false;
    this.leftMove = false;
    this.radius = 100;
    this.ground = 600;
    Entity.call(this, game, 0, 600);
}

//187, 91
//,91

Man.prototype = new Entity();
Man.prototype.constructor = Man;

Man.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.game.right) this.rightMove = true;
    if (this.game.left) this.leftMove = true;
    if (this.jumping && this.justRight) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    } else if (this.jumping) {
        if (this.jumpRevAnimation.isDone()) {
            this.jumpRevAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpRevAnimation.elapsedTime / this.jumpRevAnimation.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    } if (this.rightMove) {
      this.x = this.x + 5;
      this.justRight = true;
      this.justLeft = false;
      if (!this.game.right) {
          this.rightMove = false;
      }
    } if (this.leftMove) {
      this.x = this.x - 5;
      this.justLeft = true;
      this.justRight = false;
      if (!this.game.left) {
          this.leftMove = false;
      }
    }
    Entity.prototype.update.call(this);
}

Man.prototype.draw = function (ctx) {
    if (this.justLeft && this.jumping) {
      this.jumpRevAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
    } else if (this.justRight && this.jumping) {
      this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
    } if (this.rightMove) {
        this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
    } else if (this.leftMove) {
      this.walkRevAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
    } else if (this.justLeft) {
        this.animationRev.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
    }  else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1.2);
    }
    Entity.prototype.draw.call(this);
}


// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/idle.png");
ASSET_MANAGER.queueDownload("./img/walk.png");
ASSET_MANAGER.queueDownload("./img/idle copy.png");
ASSET_MANAGER.queueDownload("./img/walk copy.png");
ASSET_MANAGER.queueDownload("./img/gwen_idle.png");
ASSET_MANAGER.queueDownload("./img/Image_0005.jpg");
ASSET_MANAGER.queueDownload("./img/Image_0009.png");
ASSET_MANAGER.queueDownload("./img/Image_0010.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var man = new Man(gameEngine);
    var gwen = new Gwen(gameEngine);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(man);
    gameEngine.addEntity(gwen);

    gameEngine.init(ctx);
    gameEngine.start();
});
