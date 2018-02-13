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
    if (this.game.click) this.game.running = true;
}

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "sans-serif";
        ctx.fillStyle = "white";
        if (this.game.mouse) { ctx.fillStyle = "black"; }
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
  if (this.game.running) {
    if (this.game.rightScroll) this.rightScrolling = true;
    if (this.game.leftScroll) this.leftScrolling = true;
    if (this.rightScrolling) {
      this.x -= 0.7;
      if (!this.game.rightScroll) {
        this.rightScrolling = false;
      }
    } else if (this.leftScrolling) {
      this.x += 0.7;
      if (!this.game.leftScroll) {
        this.leftScrolling = false;
      }
    }
    if (this.x > 700) this.x = 0;
    if (this.x < 0) this.x = 700;
  }

    Entity.prototype.update.call(this);
}

Background.prototype.draw = function (ctx) {

    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0005.jpg"), this.x, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0005.jpg"), this.x + 699, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0005.jpg"), this.x - 699, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), this.x, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), this.x + 699, this.y);
    ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0009.png"), this.x - 699, this.y);
    // ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), this.x, this.y);
    // ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), this.x + 699, this.y);
    // ctx.drawImage(ASSET_MANAGER.getAsset("./img/Image_0010.png"), this.x - 699, this.y);

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
    this.speed = 100;
    this.radius = 100;
    this.ground = 550;
    this.height = 0;
    this.jumpHeight = 90;
    this.boxes = true;
    this.falling = false;
    this.onBox = false;
    this.platform = game.boxes[0];
    this.lastplattouch = game.boxes[0];
    this.boundingbox = new BoundingBox(this.x + 90, this.y, this.animation.frameWidth - 145, this.animation.frameHeight - 20);
    Entity.call(this, game, 0, 550);
}

//187, 91
//,91

Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.update = function () {
  if (this.game.running) {
    if (this.game.right) {
        this.rightMove = true;
    } else {
        this.rightMove = false;
    }
    if (this.game.left) {
        this.leftMove = true;
    } else {
        this.leftMove = false;
    }
    if (this.game.space && !this.jumping) {
        this.jumping = true;
        this.base = this.y;
    }
    if (this.jumping && this.justRight) {
        var height = 0;
        var duration = this.jumpAnimation.elapsedTime + this.game.clockTick;
        if (duration > this.jumpAnimation.totalTime / 2) {
             duration = this.jumpAnimation.totalTime - duration;
        }
        duration = duration / this.jumpAnimation.totalTime;

        height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
        this.lastbottom = this.boundingbox.bottom;
        this.y = this.base - height;
        this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);

        for (var i = 0; i < this.game.boxes.length; i++) {
            var box = this.game.boxes[i];
            if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top) {
                this.jumping = false;
                this.jumpAnimation.elapsedTime = 0;
                this.onBox = true;
                this.platform = box;
                this.y = box.boundingbox.top - this.animation.frameHeight + 25;
            }
        }
    } else if (this.jumping && this.justLeft) {
      var duration = this.jumpRevAnimation.elapsedTime + this.game.clockTick;
      if (duration > this.jumpRevAnimation.totalTime / 2) {
          duration = this.jumpRevAnimation.totalTime - duration;
      }
      duration = duration / this.jumpRevAnimation.totalTime;

      this.height = (4 * duration - 4 * duration * duration) * this.jumpHeight;
      this.lastbottom = this.boundingbox.bottom;
      this.y = this.base - this.height;
      this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);

      for (var i = 0; i < this.game.boxes.length; i++) {
          var box = this.game.boxes[i];
          if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top) {
              this.jumping = false;
              this.y = box.boundingbox.top - this.animation.frameHeight + 25;
              this.jumpAnimation.elapsedTime = 0;
              this.onBox = true;
              this.platform = box;
          }
      }
    }

    if (this.falling) {
        this.y += 5;
        this.lastbottom = this.boundingbox.bottom;
        this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);

        for (var i = 0; i < this.game.boxes.length; i++) {
            var box = this.game.boxes[i];
            if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top) {
                this.falling = false;
                this.y = box.boundingbox.top - this.animation.frameHeight + 25;
                this.onBox = true;
                this.platform = box;
            }
        }

        if (this.y >= this.ground) {
            this.falling = false;
            this.y = this.ground;
            this.onBox = false;
            this.lastbottom = this.y;
            this.platform = this.game.boxes[0];
        }
    }

    if (this.y >= this.ground) {
        this.onBox = false;
        this.y = this.ground;
    }

    if (this.rightMove) {
        this.x += this.speed * this.game.clockTick;
        this.boundingbox = new BoundingBox(this.x + 100, this.y, this.boundingbox.width, this.boundingbox.height);
        this.justRight = true;
        this.justLeft = false;

        for (var i = 0; i < this.game.boxes.length; i++) {
            var box = this.game.boxes[i];
            if (this.boundingbox.collide(box.boundingbox) && !this.onBox) {
                this.lastplattouch = box;
            }
        }
        if (this.boundingbox.right >= this.lastplattouch.boundingbox.left && !this.onBox && this.boundingbox.collide(this.lastplattouch.boundingbox) && !(this.lastplattouch instanceof Plat1)) {
            if (this.lastplattouch instanceof Box1 && !this.jumping && !this.lastplattouch.blocked) {
                this.lastplattouch.pushedLeft = false;
                this.lastplattouch.pushedRight = true;
                this.speed = 10;
            } else {
                this.speed = 0;
            }
        } else {
            this.speed = 75;
            this.lastplattouch.pushedRight = false;
            this.lastplattouch.pushedLeft = false;
        }
        for (var i = 0; i < this.game.boxes.length; i++) {
            var box = this.game.boxes[i];
            if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top) {
                this.jumping = false;
                this.y = box.boundingbox.top - this.animation.frameHeight + 25;
                this.jumpAnimation.elapsedTime = 0;
                this.onBox = true;
                this.platform = box;
            }
        }
        if (this.boundingbox.left > this.platform.boundingbox.right && this.onBox && !this.jumping) {
            this.falling = true;
            this.onBox = false;
        }
        if (!this.game.right) {
            this.rightMove = false;
        }

    } else if (this.leftMove) {
        this.x -= this.speed * this.game.clockTick;
        this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);
        this.justRight = false;
        this.justLeft = true;

        for (var i = 0; i < this.game.boxes.length; i++) {
            var box = this.game.boxes[i];
            if (this.boundingbox.collide(box.boundingbox) && !this.onBox) {
                this.lastplattouch = box;
            }
        }
        if (this.boundingbox.left <= this.lastplattouch.boundingbox.right && !this.onBox && this.boundingbox.collide(this.lastplattouch.boundingbox) && !(this.lastplattouch instanceof Plat1)) {
            if (this.lastplattouch instanceof Box1 && !this.jumping && !this.lastplattouch.blocked) {
                this.speed = 10;
                this.lastplattouch.pushedRight = false;
                this.lastplattouch.pushedLeft = true;
            } else {
                this.speed = 0;
            }
        } else {
            this.speed = 75;
            this.lastplattouch.pushedLeft = false;
            this.lastplattouch.pushedRight = false;
        }

        for (var i = 0; i < this.game.boxes.length; i++) {
            var box = this.game.boxes[i];
            if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top) {
                this.jumping = false;
                this.y = box.boundingbox.top - this.animation.frameHeight + 25;
                this.jumpAnimation.elapsedTime = 0;
                this.onBox = true;
                this.platform = box;
            }
        }

        if (this.boundingbox.right < this.platform.boundingbox.left && this.onBox && !this.jumping) {
            this.falling = true;
            this.onBox = false;
        }
        if (!this.game.left) {
            this.leftMove = false;
        }

    }
    if (!this.rightMove && !this.leftMove) {
        this.lastplattouch.pushedRight = false;
        this.lastplattouch.pushedLeft = false;
    }
    // for (var i = 0; i < this.game.boxes.length; i++) {
    //     var box = this.game.boxes[i];
    //     if (this.onBox && this.boundingbox.collide(box.boundingbox) && !(box === this.lastplattouch) && !(box instanceof Box1)) {
    //         this.speed = 0;
    //     }
    // }

  }

    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    if (this.boxes) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    }
    if (this.justLeft && this.jumping) {
      this.jumpRevAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
        if (this.jumpRevAnimation.isDone()) {
            this.jumpRevAnimation.elapsedTime = 0;
            this.jumping = false;
        }
    } else if (this.justRight && this.jumping) {
      this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
      if (this.jumpAnimation.isDone()) {
          this.jumpAnimation.elapsedTime = 0;
          this.jumping = false;
      }
    }
     if (this.rightMove) {
        this.walkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } else if (this.leftMove) {
      this.walkRevAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } else if (this.justLeft) {
        this.animationRev.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    }
    Entity.prototype.draw.call(this);
}

function Box1(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/box1.png"), 0, 0, 144, 144, 1, 1, true, false);
    this.ground = 630;
    this.boxes = true;
    this.speed = 10;
    this.pushedRight = false;
    this.pushedLeft = false;
    this.blocked = false;
    this.boundingbox = new BoundingBox(400, 545, width * .5, height * .5);
    Entity.call(this, game, this.x, this.y);
}

Box1.prototype = new Entity();
Box1.prototype.constructor = Box1;

Box1.prototype.update = function () {
//    if (this.game.rightScroll) this.rightScrolling = true;
//    if (this.game.leftScroll) this.leftScrolling = true;
//    if (this.rightScrolling) {
//        this.x -= 0.7;
//        this.boundingbox.x -= 0.7;
//        if (!this.game.rightScroll) {
//            this.rightScrolling = false;
//        }
//    } else if (this.leftScrolling) {
//        this.x += 0.7;
//        this.boundingbox.x += 0.7;
//        if (!this.game.leftScroll) {
//            this.leftScrolling = false;
//        }
//    }
    for (var i = 0; i < this.game.boxes.length; i++) {
        var box = this.game.boxes[i];
        if (this.boundingbox.collide(box.boundingbox) && !(box instanceof Box1)) {
            this.pushedRight = false;
            this.blocked = true;
        }
    }
    if (this.pushedRight) {
        this.x += this.speed * this.game.clockTick;
        this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);

    } else if (this.pushedLeft) {
        this.x -= this.speed * this.game.clockTick;
        this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height *.5);
    }
}

Box1.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    ctx.strokeStyle = "blue";
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5); //400, 640
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
}

function Box2(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/box2.png"), 0, 0, 144, 144, 1, 1, true, false);
    this.ground = 650;
    this.pushed = false;
    this.boundingbox = new BoundingBox(this.x, this.y, width * .5, height * .5);
    Entity.call(this, game, this.x, this.y);
}

Box2.prototype = new Entity();
Box2.prototype.constructor = Box2;

Box2.prototype.update = function () {
//    if (this.game.rightScroll) this.rightScrolling = true;
//    if (this.game.leftScroll) this.leftScrolling = true;
//    if (this.rightScrolling) {
//        this.x -= 0.7;
//        this.boundingbox.x -= 0.7;
//        if (!this.game.rightScroll) {
//            this.rightScrolling = false;
//        }
//    } else if (this.leftScrolling) {
//        this.x += 0.7;
//        this.boundingbox.x += 0.7;
//        if (!this.game.leftScroll) {
//            this.leftScrolling = false;
//        }
//    }
}

Box2.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    ctx.strokeStyle = "green";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
}

function Ground(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/Image_0010.png"), 0, 0, 350, 86, 1, 1, true, false);
    this.boundingbox = new BoundingBox(this.x, this.y, width * .5, height * .5)
    Entity.call(this, game, this.x, this.y);
}

Ground.prototype = new Entity();
Ground.prototype.constuctor = Ground;

Ground.prototype.update = function () {
    if (this.game.rightScroll) this.rightScrolling = true;
    if (this.game.leftScroll) this.leftScrolling = true;
    if (this.rightScrolling) {
        this.x -= 0.7;
        this.boundingbox.x -= 0.7;
        if (!this.game.rightScroll) {
            this.rightScrolling = false;
        }
    } else if (this.leftScrolling) {
        this.x += 0.7;
        this.boundingbox.x += 0.7;
        if (!this.game.leftScroll) {
            this.leftScrolling = false;
        }
    }
  // this.x -= 400 * this.game.clockTick;
  // if (this.x + this.width < 0) this.x += 3200;
  // this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
  Entity.prototype.update.call(this);
}

Ground.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    for (var i = 0; i < 10; i++) {
        if (i % 3 !== 0 || i === 0) {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x + (i * 349), this.y, 1);
        }
    }
}

function Plat1(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.ogX = x;
    this.speed = 75;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/woodplat.png"), 0, 0, 553, 92, 1, 1, true, false);
    this.boundingbox = new BoundingBox(this.x, this.y, width * .5, height * .5);
    Entity.call(this, game, this.x, this.y);
}

Plat1.prototype = new Entity();
Plat1.prototype.constructor = Plat1;

Plat1.prototype.update = function () {
//    if (this.game.rightScroll) this.rightScrolling = true;
//    if (this.game.leftScroll) this.leftScrolling = true;
//    if (this.rightScrolling) {
//        this.x -= 0.7;
//        this.boundingbox.x -= 0.7;
//        if (!this.game.rightScroll) {
//            this.rightScrolling = false;
//        }
//    } else if (this.leftScrolling) {
//        this.x += 0.7;
//        this.boundingbox.x += 0.7;
//        if (!this.game.leftScroll) {
//            this.leftScrolling = false;
//        }
//    }
    if (this.x <= this.ogX) {
        this.rightMove = true;
        this.leftMove = false;
    } else if (this.x >= this.ogX + 150) {
        this.rightMove = false;
        this.leftMove = true;
    }

    if (this.rightMove) {
        this.x += this.speed * this.game.clockTick;
    } else if (this.leftMove) {
        this.x -= this.speed * this.game.clockTick;
    }
    this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);

}

Plat1.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    ctx.strokestyle = "purple";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
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
ASSET_MANAGER.queueDownload("./img/woodplat.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    var gameEngine = new GameEngine();
    var boxes = [];
    var bg = new Background(gameEngine);
    var ground = new Ground(gameEngine, 0, 615, 350, 700);
    var box = new Box1(gameEngine, 400, 545, 144, 144);
    var box2 = new Box2(gameEngine, 544, 545, 144, 144);
    var box3 = new Box2(gameEngine, 230, 545, 144, 144);
    var plat = new Plat1(gameEngine, 150, 450, 545, 92);

    gameEngine.running = false;
    gameEngine.dead = false;

    gameEngine.addEntity(bg);
    gameEngine.addEntity(ground);
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
    var pg = new PlayGame(gameEngine, 700, 400);
    gameEngine.addEntity(unicorn);
    gameEngine.addEntity(pg);

    gameEngine.init(ctx);
    gameEngine.start();
});
