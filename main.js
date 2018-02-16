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

BoundingBox.prototype.collideLightning = function (oth) {
  if ((this.right > oth.left && this.left < oth.right) || (this.right > oth.right && this.left < oth.left)) {
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

PlayGame.prototype.reset = function () {
    this.game.running = false;
}

PlayGame.prototype.update = function () {
    if (this.game.click){
        if(!this.game.running){
            ASSET_MANAGER.getAsset("./asset_lib/audio/Aquatic_Ambiance_2.mp3").loop = true;
            ASSET_MANAGER.getAsset("./asset_lib/audio/Aquatic_Ambiance_2.mp3").play();
        }
    	this.game.running = true;
    	// hide(0, 2000, "dialogue");
      setTimeout(function () {
        setFSize("dialogue", "300%");
      }, 2100)
    }
}

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "70% pixel1";
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
  this.game = game;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.reset = function () {
  this.x = 0;
  this.y = 0;
}

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
		x += 699;
	}

}

// the "main" code begins here
var gameEngine = new GameEngine();
var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/box1.png");
ASSET_MANAGER.queueDownload("./img/box2.png");
ASSET_MANAGER.queueDownload("./img/lizard.png");
ASSET_MANAGER.queueDownload("./img/lizard_right.png");
ASSET_MANAGER.queueDownload("./img/gwen_idle.png");
ASSET_MANAGER.queueDownload("./img/pc_idle.png");
ASSET_MANAGER.queueDownload("./img/pc_walk.png");
ASSET_MANAGER.queueDownload("./img/pc_idle_l.png");
ASSET_MANAGER.queueDownload("./img/pc_walk_l.png");
ASSET_MANAGER.queueDownload("./img/pc_jump.png");
ASSET_MANAGER.queueDownload("./img/pc_jump_l.png");
ASSET_MANAGER.queueDownload("./img/kid_talk_l.png");
ASSET_MANAGER.queueDownload("./img/Image_0005.jpg");
ASSET_MANAGER.queueDownload("./img/Image_0009.png");
ASSET_MANAGER.queueDownload("./img/Image_0010.png");
ASSET_MANAGER.queueDownload("./img/woodplat.png");
ASSET_MANAGER.queueDownload("./img/lightning.png");
ASSET_MANAGER.queueDownload("./img/scrap.png");
ASSET_MANAGER.queueDownload("./img/plate.png");
ASSET_MANAGER.queueDownload("./img/plate_rev.png");
ASSET_MANAGER.queueDownload("./img/lever.png");
ASSET_MANAGER.queueDownload("./img/lever_still.png");
ASSET_MANAGER.queueDownload("./img/lever_still_rev.png");
ASSET_MANAGER.queueDownload("./img/door_open.png");
ASSET_MANAGER.queueDownload("./img/door_closed.png");
ASSET_MANAGER.queueDownload("./asset_lib/audio/lightning.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/explosion.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/step.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/jump.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/Aquatic_Ambiance_2.mp3");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var boxes = [];

    var bg = new Background(gameEngine);


    var box = new Box1(gameEngine, 400, 627, 144, 144);
    var box2 = new Box2(gameEngine, 544, 627, 144, 144);
    var box3 = new Box2(gameEngine, 230, 627, 144, 144);
    var box4 = new Box2(gameEngine, 544, 555, 144, 144);


    var plat = new Plat1(gameEngine, 650, 540, 553, 92);
    var plat2 = new Plat2(gameEngine, 100, 580, 553, 92);
    var floorplat1 = new Plat3(gameEngine, 0, 700, 350, 87);

    gameEngine.addEntity(bg);
    gameEngine.addEntity(floorplat1);
    gameEngine.addEntity(box);
    gameEngine.addEntity(box2);
    gameEngine.addEntity(box3);
    gameEngine.addEntity(box4);
    gameEngine.addEntity(plat);
    gameEngine.addEntity(plat2);

    boxes.push(floorplat1);
    for (var i = 1; i < 23; i++) {
      if (i !== 3 && i !== 7 && i !== 15 && i !== 20) {
        var plat3 = new Plat3(gameEngine, i * (349 * .75), 700, 350, 87);
        gameEngine.addEntity(plat3);
        boxes.push(plat3);
      }
    }

    var lever = new Lever(gameEngine, 1100, 575, 192, 192);
    gameEngine.addEntity(lever);
    boxes.push(lever);

    // var lever = new Lever(gameEngine, 300, 575, 192, 192);
    // gameEngine.addEntity(lever);
    // boxes.push(lever);

    var kid = new Child(gameEngine, 200, 620, 192, 192);
    gameEngine.addEntity(kid);
    boxes.push(kid);

    // for (var j = 1; j < 6; j++) {
    //   var scrap = new ScrapMetal(gameEngine, 250 * j, 665, 142, 87);
    //   gameEngine.addEntity(scrap);
    //   boxes.push(scrap);
    // }

    for (var j = 1; j < 6; j++) {
      var light = new Lightning(gameEngine, 300 * j, 0, 192, 768);
      gameEngine.addEntity(light);
      boxes.push(light);
    }

    var plate = new Plate(gameEngine, 100, 605, 192, 192);
    gameEngine.addEntity(plate);
    boxes.push(plate);


    boxes.push(box);
    boxes.push(box2);
    boxes.push(box3);
    boxes.push(box4);
    boxes.push(plat);
    boxes.push(plat2);

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
