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
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0005.jpg"), 800, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), this.x, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), 800, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), this.x, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), 800, this.y);

}



function Unicorn(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/idle.png"), 0, 0, 187, 91, 0.1, 109, true, false);
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/idle.png"), 0, 0, 187, 91, 0.1, 16, false, false);
    this.animationRev = new Animation(ASSET_MANAGER.getAsset("./img/idle copy.png"), 0, 0, 187, 91, 0.1, 105, true, false);
    this.walkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/walk.png"), 0, 0, 187, 91, 0.05, 16, true, false);
    this.jumpRevAnimation = new Animation(ASSET_MANAGER.getAsset("./img/idle copy.png"), 0, 0, 187, 91, 0.1, 16, false, false);
    this.walkRevAnimation = new Animation(ASSET_MANAGER.getAsset("./img/walk_left.png"), 0, 0, 187, 91, 0.05, 16, true, true);
    this.jumping = false;
    this.rightMove = false;
    this.leftMove = false;
    this.speed = 75;
    this.radius = 100;
    this.ground = 650;
    Entity.call(this, game, 0, 650);
}

//187, 91
//,91

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
    if (this.game.space) this.jumping = true;
    if (this.game.right) this.rightMove = true;
    if (this.game.left) this.leftMove = true;
    if (this.jumping && this.justRight) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 75;

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
        var totalHeight = 75;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    } if (this.rightMove) {
      this.x += this.speed * this.game.clockTick;
      this.justRight = true;
      this.justLeft = false;
      if (!this.game.right) {
          this.rightMove = false;
      }
    } if (this.leftMove) {
      this.x -= this.speed * this.game.clockTick;
      this.justLeft = true;
      this.justRight = false;
      if (!this.game.left) {
          this.leftMove = false;
      }
    }
    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (this.justLeft && this.jumping) {
      this.jumpRevAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } else if (this.justRight && this.jumping) {
      this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } if (this.rightMove) {
        this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } else if (this.leftMove) {
      this.walkRevAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } else if (this.justLeft) {
        this.animationRev.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    }  else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    }
    Entity.prototype.draw.call(this);
}

function Gwen(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/gwen_idle.png"), 0, 0, 116, 191, 0.1, 76, true, false);
    this.speed = 50;
    this.right = true;
    this.left = false;
    this.radius = 100;
    this.ground = 570;
    Entity.call(this, game, 500, 620);
}

Gwen.prototype = new Entity();
Gwen.prototype.constructor = Gwen;

Gwen.prototype.update = function () {
      if (this.x >= 800) {
          this.right = false;
          this.left = true;
      } else if (this.x <= 100) {
          this.right = true;
          this.left = false;
      }
      if (this.right) {
          this.x += this.speed * this.game.clockTick;
      } else if (this.left) {
          this.x -= this.speed * this.game.clockTick;
      }
      Entity.prototype.update.call(this);
}

Gwen.prototype.draw = function (ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
      Entity.prototype.draw.call(this);
}

function Lizard(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/lizard.png"), 0, 0, 156, 88, 0.1, 4, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/lizard_right.png"), 0, 0, 156, 88, 0.1, 4, true, true);
    this.speed = 250;
    this.right = true;
    this.left = false;
    this.radius = 100;
    this.ground = 570;
    Entity.call(this, game, 500, 680);
}

Lizard.prototype = new Entity();
Lizard.prototype.constructor = Lizard;

Lizard.prototype.update = function () {
      if (this.x >= 800) {
          this.right = false;
          this.left = true;
      } else if (this.x <= 400) {
          this.right = true;
          this.left = false;
      }
      if (this.right) {
          this.x += this.speed * this.game.clockTick;
      } else if (this.left) {
          this.x -= this.speed * this.game.clockTick;
      }
      Entity.prototype.update.call(this);
}

Lizard.prototype.draw = function (ctx) {
    if (this.right) {
        this.rightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
    }
    Entity.prototype.draw.call(this);
}

function Box1(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/box1.png"), 0, 0, 144, 144, 1, 1, true, false);
    this.ground = 600;
    Entity.call(this, game, this, 0, 0);
}

Box1.prototype = new Entity();
Box1.prototype.constructor = Box1;

Box1.prototype.update = function () {

}

Box1.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, 400, 640, .5);
    this.animation.drawFrame(this.game.clockTick, ctx, 472, 640, .5);
}

function Box2(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/box2.png"), 0, 0, 144, 144, 1, 1, true, false);
    this.ground = 650;
    Entity.call(this, game, this, 0, 0);
}

Box2.prototype = new Entity();
Box2.prototype.constructor = Box2;

Box2.prototype.update = function () {

}

Box2.prototype.draw = function (ctx) {
    this.animation.drawFrame(this.game.clockTick, ctx, 544, 640, .5);
    this.animation.drawFrame(this.game.clockTick, ctx, 472, 568, .5);
}


// the "main" code begins here

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


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    var unicorn = new Unicorn(gameEngine);
    var box = new Box1(gameEngine);
    var box2 = new Box2(gameEngine);
    var gwen = new Gwen(gameEngine);
    var lizard = new Lizard(gameEngine);


    gameEngine.addEntity(bg);
    gameEngine.addEntity(gwen);
    gameEngine.addEntity(box);
    gameEngine.addEntity(box2);
    gameEngine.addEntity(lizard);
    gameEngine.addEntity(unicorn);


    gameEngine.init(ctx);
    gameEngine.start();
});
