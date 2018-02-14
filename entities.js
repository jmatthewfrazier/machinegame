
function Box1(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.width = width;
    this.height = height;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/box1.png"), 0, 0, 144, 144, 1, 1, true, false);
    this.ground = 600;
    this.boxes = true;
    this.speed = 25;
    this.pushedRight = false;
    this.pushedLeft = false;
    this.blocked = false;
    this.boundingbox = new BoundingBox(400, 640, width * .5, height * .5);
    Entity.call(this, game, this.x, this.y);
}

Box1.prototype = new Entity();
Box1.prototype.constructor = Box1;

Box1.prototype.reset = function() {
  this.x = this.startX;
  this.y = this.startY;
  this.ground = 600;
  this.boxes = true;
  this.speed = 25;
  this.pushedRight = false;
  this.pushedLeft = false;
  this.blocked = false;
}

Box1.prototype.update = function () {
    //yo, check to see that I haven't been pushed into another box.
    //If I have, make sure I don't move any further.
    for (var i = 0; i < this.game.boxes.length; i++) {
        var box = this.game.boxes[i];
        if (this.boundingbox.collide(box.boundingbox) && !(box instanceof Box1)) {
            this.pushedRight = false;
            this.blocked = true;
        }
    }
    //If I'm being pushed right, then I'm going right and I'm taking my bounding box with me.
    if (this.pushedRight) {
        this.x += this.speed * this.game.clockTick;
        this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);

    //If I'm being pushed left.... you get it.
    } else if (this.pushedLeft) {
        this.x -= this.speed * this.game.clockTick;
        this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height *.5);
    }
}

Box1.prototype.draw = function (ctx) {
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

Box12prototype.reset = function() {
  this.ground = 650;
  this.pushed = false;
}

Box2.prototype.update = function () {

}

Box2.prototype.draw = function (ctx) {
    ctx.strokeStyle = "green";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
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
    //if I'm further left than where I started out, go the other way!
    //else if I'm further right than where I should be, go the other way!
    if (this.x <= this.ogX) {
        this.rightMove = true;
        this.leftMove = false;
    } else if (this.x >= this.ogX + 150) {
        this.rightMove = false;
        this.leftMove = true;
    }

    //If I'm supposed to be moving right then I should move right and vice versa
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

function Plat2(game, x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.ogY = y;
  this.speed = 75;
  this.animation = new Animation(ASSET_MANAGER.getAsset("./img/woodplat.png"), 0, 0, 553, 92, 1, 1, true, false);
  this.boundingbox = new BoundingBox(this.x, this.y, width * .5, height * .5);
  Entity.call(this, game, this.x, this.y);
}

Plat2.prototype = new Entity();
Plat2.prototype.constructor = Plat2;

Plat2.prototype.update = function () {
    if (this.y >= this.ogY) {
        this.upMove = true;
        this.downMove = false;
    } else if (this.y <= this.ogY - 150) {
        this.upMove = false;
        this.downMove = true;
    }

    if (this.upMove) {
        this.y -= this.speed * this.game.clockTick;
    } else if (this.downMove) {
        this.y += this.speed * this.game.clockTick;
    }
    this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);

}

Plat2.prototype.draw = function (ctx) {
    ctx.strokestyle = "purple";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
}

function Plat3(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/Image_0010.png"), 0, 0, 350, 87, 1, 1, true, false);
    this.boundingbox = new BoundingBox(this.x, this.y, width * .75, height * .75);
    Entity.call(this, game, this.x, this.y);
}

Plat3.prototype = new Entity();
Plat3.prototype.constructor = Plat3;

Plat3.prototype.update = function () {

}

Plat3.prototype.draw = function (ctx) {
    ctx.strokestyle = "black";
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.width * .75, this.height * .75);

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

/**
 * -------------------------------------
 * Hero Entity
 * -------------------------------------
 */
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

  }

    Entity.prototype.update.call(this);
}

Unicorn.prototype.draw = function (ctx) {
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
