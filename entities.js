
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
    this.boundingbox = new BoundingBox(400, 627, width * .5, height * .5);
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
  this.boundingbox = new BoundingBox(400, 627, this.width * .5, this.height * .5);
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
    if (!this.game.running) return;
    ctx.strokeStyle = "blue";
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5); //400, 640
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
}

function Box2(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
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

Box2.prototype.reset = function() {
  this.x = this.startX;
  this.y = this.startY;
  this.width = this.width;
  this.height = this.height;
  this.ground = 650;
  this.pushed = false;
  this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);
}

Box2.prototype.update = function () {

}

Box2.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    ctx.strokeStyle = "green";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
}

function Plat1(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
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

Plat1.prototype.reset = function () {
  this.x = this.startX;
  this.y = this.startY;
  this.ogX = this.startX;
  this.speed = 75;
  this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);
}

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

    if (this.game.entities[this.game.entities.length - 2].scroll) {
        this.ogX -= this.speed * this.game.clockTick;
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
  this.startX = x;
  this.startY = y;
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

Plat2.prototype.reset = function () {
  this.x = this.startX;
  this.y = this.startY;
  this.speed = 75;
  this.boundingbox = new BoundingBox(this.x, this.y, this.width * .5, this.height * .5);
}

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
  if (!this.game.running) return;
    ctx.strokestyle = "purple";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .5);
}

function Plat3(game, x, y, width, height) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/Image_0010.png"), 0, 0, 350, 87, 1, 1, true, false);
    this.boundingbox = new BoundingBox(this.x, this.y, width * .75, height * .75);
    Entity.call(this, game, this.x, this.y);
}

Plat3.prototype = new Entity();
Plat3.prototype.constructor = Plat3;

Plat3.prototype.reset = function () {
  this.x = this.startX;
  this.y = this.startY;
  this.boundingbox.x = this.startX;
}

Plat3.prototype.update = function () {

}

Plat3.prototype.draw = function (ctx) {
    if (!this.game.running) return;
    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, .75);
    ctx.strokeStyle = "red";
    ctx.strokeRect(this.boundingbox.x, this.boundingbox.y, this.boundingbox.width, this.boundingbox.height);

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
    //this.ground = 550;
    this.height = 0;
    this.jumpHeight = 90;
    this.boxes = true;
    this.falling = false;
    this.onBox = true;
    this.platform = game.boxes[0];
    this.lastplattouch = game.boxes[0];
    this.scroll = false;
    this.boundingbox = new BoundingBox(this.x + 90, this.y, this.animation.frameWidth - 145, this.animation.frameHeight - 20);
    Entity.call(this, game, 0, this.platform.boundingbox.top - this.animation.frameHeight + 25);
}

/**
 * -------------------------------------
 * Hero Entity
 * -------------------------------------
 */
Unicorn.prototype = new Entity();
Unicorn.prototype.constructor = Unicorn;

Unicorn.prototype.reset = function () {
  this.dead = false;
  this.jumping = false;
  this.rightMove = false;
  this.leftMove = false;
  this.speed = 100;
  this.radius = 100;
  //this.ground = 550;
  this.height = 0;
  this.jumpHeight = 90;
  this.boxes = true;
  this.falling = false;
  this.onBox = true;
  this.platform = this.game.boxes[0];
  this.lastplattouch = this.game.boxes[0];
  this.x = 0;
  this.y = this.platform.boundingbox.top - this.animation.frameHeight + 25;
  this.boundingbox = new BoundingBox(this.x + 90, this.y, this.animation.frameWidth - 145, this.animation.frameHeight - 20);
}

Unicorn.prototype.update = function () {

    if (this.game.running) {
      if (this.y >= 900) {
        this.dead = true;
      }
      if (this.dead) {
        this.game.reset();
        return;
      }
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
          this.onBox = false;
          this.base = this.y;
      }
      if (this.jumping && this.justRight) {
          this.onBox = false;
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
              if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top && this.boundingbox.right > box.boundingbox.left) {
                  this.jumping = false;
                  this.jumpAnimation.elapsedTime = 0;
                  this.onBox = true;
                  this.platform = box;
                  this.y = box.boundingbox.top - this.animation.frameHeight + 25;
              }
          }

          if (this.boundingbox.left >= this.platform.boundingbox.right) {
                this.falling = true;
          }
      } else if (this.jumping && this.justLeft) {
          this.onBox = false;
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
          if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top && this.boundingbox.left < this.boundingbox.right) {
              this.jumping = false;
              this.y = box.boundingbox.top - this.animation.frameHeight + 25;
              this.jumpAnimation.elapsedTime = 0;
              this.onBox = true;
              this.platform = box;
          }
      }

      if (this.boundingbox.right <= this.platform.boundingbox.left) {
          this.falling = true;
      }
  }

  if (this.falling) {
      this.y += 5;
      this.lastbottom = this.boundingbox.bottom;
      this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);

      //yo, check to see if I fall onto another box or a platform, would ya?
      for (var i = 0; i < this.game.boxes.length; i++) {
          var box = this.game.boxes[i];
          if (this.boundingbox.collide(box.boundingbox) && this.lastbottom <= box.boundingbox.top) {
              this.falling = false;
              this.y = box.boundingbox.top - this.animation.frameHeight + 25;
              this.onBox = true;
              this.platform = box;
          }
      }

      //if my y coordinate falls equal to or lower than the ground, then I'm probably supposed to land on the ground
      if (this.y >= this.ground) {
          this.falling = false;
          this.y = this.ground;
          this.onBox = false;
          this.lastbottom = this.y;
          this.platform = this.game.boxes[0];
      }
  }

  //look, if my y coordinate is greater than or equal to the ground's y coordinate,
  //then I'm definitely not on a box so my y coordinate should be on the ground
  if (this.y >= this.ground) {
      this.onBox = false;
      this.y = this.ground;
  }

  if (this.rightMove) {
      this.x += this.speed * this.game.clockTick;
      this.boundingbox = new BoundingBox(this.x + 100, this.y, this.boundingbox.width, this.boundingbox.height);
      this.justRight = true;
      this.justLeft = false;

      //if I collide with a box, I'm going to remember that box
      for (var i = 0; i < this.game.boxes.length; i++) {
          var box = this.game.boxes[i];
          if (this.boundingbox.collide(box.boundingbox) && this.boundingbox.right >= box.boundingbox.left && !(this.platform === box)) {
              this.lastplattouch = box;
          }
      }

      //if I walk right into a box on the ground and that box is of type Box1 and it's not blocked by another box,
      //push that bish right
      //otherwise don't move because you can't push that kind of box
      if (this.boundingbox.right >= this.lastplattouch.boundingbox.left && this.boundingbox.collide(this.lastplattouch.boundingbox)  && !(this.lastplattouch instanceof Plat1) && !(this.lastplattouch instanceof Plat2)&& !(this.lastplattouch instanceof Plat3)) {
          if (this.lastplattouch instanceof Box1 && !this.jumping && !this.lastplattouch.blocked && !(this.platform instanceof Box1)) {
              this.lastplattouch.pushedLeft = false;
              this.lastplattouch.pushedRight = true;
              this.speed = 25;
          } else {
              this.speed = 0;
          }
      } else {
          this.speed = 75;
          this.lastplattouch.pushedRight = false;
          this.lastplattouch.pushedLeft = false;
      }

      //Had to check if I'm jumping right and land on a platform you bess belee that I land on that son of a gun
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

      //if I move right off of a box or a platform, I should fall off of the box. Right?
      if (this.boundingbox.left > this.platform.boundingbox.right && this.onBox && !this.jumping) {
          this.falling = true;
          this.onBox = false;
      }

      if (this.x >= 500) {
          this.scroll = true;
      } else {
          this.scroll = false;
      }

      if (!this.game.right) {
          this.rightMove = false;
      }

  } else if (this.leftMove) {
      this.x -= this.speed * this.game.clockTick;
      this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);
      this.justRight = false;
      this.justLeft = true;

      //if I collide with a box, I'm going to remember that box
      for (var i = 0; i < this.game.boxes.length; i++) {
          var box = this.game.boxes[i];
          if (this.boundingbox.collide(box.boundingbox) && this.boundingbox.left <= box.boundingbox.right && !(this.platform === box)) {
              this.lastplattouch = box;
          }
      }

      //If I'm moving left on the ground and I run into a box, and that box is of type Box1 and it's not blocked by another box
      //push that bish left
      //otherwise, stop moving because you can't push that type of box
      if (this.boundingbox.left <= this.lastplattouch.boundingbox.right && this.boundingbox.collide(this.lastplattouch.boundingbox) && !(this.lastplattouch instanceof Plat1) && !(this.lastplattouch instanceof Plat2) && !(this.lastplattouch instanceof Plat3)) {
          if (this.lastplattouch instanceof Box1 && !this.jumping && !this.lastplattouch.blocked && !(this.platform instanceof Box1)) {
              this.speed = 25;
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

      //had to insert again because if I'm holding left in the air it'll fall under this if(this.leftMove) block
      //checking to see if I land on a platform. If so, stop jumping
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

      //If i walk left off of a platform, you bess belee that I'm falling off that bish
      if (this.boundingbox.right < this.platform.boundingbox.left && this.onBox && !this.jumping) {
          this.falling = true;
          this.onBox = false;
      }
      if (!this.game.left) {
          this.leftMove = false;
      }

  }
  //if you're not moving, the box you were pushing should stop moving too
  if (!this.rightMove && !this.leftMove) {
      this.lastplattouch.pushedRight = false;
      this.lastplattouch.pushedLeft = false;
      this.scroll = false;
  }

  if (this.onBox) {
      this.y = this.platform.boundingbox.top - this.animation.frameHeight + 25;
      if (this.platform instanceof Plat1) {
          if (this.platform.rightMove) {
              this.x += this.platform.speed * this.game.clockTick;
          } else if (this.platform.leftMove) {
              this.x -= this.platform.speed * this.game.clockTick;
          }
      }
  }

  //if you're on a box and you collide with another box you should stop moving.
  //except if that "box" is a platform, you should be able to move through its bounding box
  for (var i = 0; i < this.game.boxes.length; i++) {
      var box = this.game.boxes[i];
      if (this.onBox && this.boundingbox.collide(box.boundingbox) && !(box instanceof Plat1) && !(box instanceof Plat2)) {
          if (!(box === this.platform)) {
              this.speed = 0;
          } else {
              this.speed = 75;
          }
      }
  }
  this.boundingbox = new BoundingBox(this.x + 90, this.y, this.boundingbox.width, this.boundingbox.height);

  if (this.scroll && this.rightMove) {
      for (var i = 0; i < this.game.boxes.length; i++) {
          var thing = this.game.boxes[i];
          thing.x -= this.speed * this.game.clockTick;
          thing.boundingbox = new BoundingBox(thing.x, thing.y, thing.boundingbox.width, thing.boundingbox.height);
      }
      this.speed = 0;
  }

  Entity.prototype.update.call(this);
}
}

Unicorn.prototype.draw = function (ctx) {
  if(!this.game.running) return;
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
