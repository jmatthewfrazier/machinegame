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
            music.volume = 0.5;
            music.loop = true;
            music.play();
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
        ctx.font = "100% pixel1";
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
ASSET_MANAGER.queueDownload("./img/pc_push_l.png");
ASSET_MANAGER.queueDownload("./img/pc_push.png");
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
ASSET_MANAGER.queueDownload("./asset_lib/audio/solved.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/ded.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/step.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/jump.wav");

//MUSIC LAST
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

//BOX 1 (PUSHING)

  var box1_0 = new Box1(gameEngine, 500, 627, 144, 144);
  var box1_1 = new Box1(gameEngine, 1678, 627, 144, 144);
  var box1_2 = new Box1(gameEngine, 4900, 627, 144, 144);
  var box1_3 = new Box1(gameEngine, 5950, 627, 144, 144);

//BOX 2 (NO PUSH)
  var box2_5 = new Box2(gameEngine, 300, 627, 144, 144);
  var box2_0 = new Box2(gameEngine, 700, 555, 144, 144);
  var box2_1 = new Box2(gameEngine, 700, 627, 144, 144);
  var box2_2 = new Box2(gameEngine, 3800, 627, 144, 144);
  var box2_7 = new Box2(gameEngine, 6200, 627, 144, 144);
  var box2_8 = new Box2(gameEngine, 6200, 555, 144, 144);
  var box2_3 = new Box2(gameEngine, 6372, 555, 144, 144);
  var box2_4 = new Box2(gameEngine, 6372, 627, 144, 144);
  var box2_6 = new Box2(gameEngine, 6372, 483, 144, 144);

//PLAT1

  var plat1_0 = new Plat1(gameEngine, 800, 540, 553, 92);
  var plat1_1 = new Plat1(gameEngine, 1700, 540, 553, 92);
  var plat1_2 = new Plat1(gameEngine, 3950, 540, 553, 92);

//PLAT2

  var plat2_0 = new Plat2(gameEngine, 5275, 600, 553, 92);
  var plat2_1 = new Plat2(gameEngine, 5500, 500, 553, 92);

//SCRAP METAL

  var scrap_0 = new ScrapMetal(gameEngine, 1400, 640, 192, 192);
  var scrap_1 = new ScrapMetal(gameEngine, 2390, 640, 192, 192);
  var scrap_2 = new ScrapMetal(gameEngine, 2740, 640, 192, 192);
  var scrap_3 = new ScrapMetal(gameEngine, 3550, 640, 192, 192);
  var scrap_4 = new ScrapMetal(gameEngine, 4510, 640, 192, 192);

//LIGHTNING

  var light_0 = new Lightning(gameEngine, 1212, 0, 192, 768);
  var light_1 = new Lightning(gameEngine, 4200, 0, 192, 768);
  var light_2 = new Lightning(gameEngine, 4358, 0, 192, 768);
  var light_3 = new Lightning(gameEngine, 4725, 0, 192, 768);
  var light_4 = new Lightning(gameEngine, 2500, 0, 192, 768);

//LEVER

  var lever_0 = new Lever(gameEngine, 3111, 575, 192, 192);

//PLATE

  var plate_0 = new Plate(gameEngine, 7200, 605, 192, 192);

//NPC

  var kid = new Child(gameEngine, 7600, 620, 192, 192);

  var end = new EndLevel(gameEngine, 7700, 620, 500, 500);

  var floorplat1 = new Plat3(gameEngine, 0, 700, 350, 87);

  gameEngine.addEntity(bg);
  gameEngine.addEntity(floorplat1);


  boxes.push(floorplat1);
  for (var i = 1; i < 50; i++) {
    if (i !== 3 && i !== 7 && i !== 15 && i !== 20) {
      var plat3 = new Plat3(gameEngine, i * (349 * .75), 700, 350, 87);
      gameEngine.addEntity(plat3);
      boxes.push(plat3);
    }
  }

  gameEngine.addEntity(box1_0);
  gameEngine.addEntity(box1_1);
  gameEngine.addEntity(box1_2);
  gameEngine.addEntity(box1_3);

  gameEngine.addEntity(box2_0);
  gameEngine.addEntity(box2_1);
  gameEngine.addEntity(box2_2);
  gameEngine.addEntity(box2_3);
  gameEngine.addEntity(box2_4);
  gameEngine.addEntity(box2_5);
  gameEngine.addEntity(box2_6);
  gameEngine.addEntity(box2_7);
  gameEngine.addEntity(box2_8);

  gameEngine.addEntity(plat1_0);
  gameEngine.addEntity(plat1_1);
  gameEngine.addEntity(plat1_2);

  gameEngine.addEntity(plat2_0);
  gameEngine.addEntity(plat2_1);

  gameEngine.addEntity(scrap_0);
  gameEngine.addEntity(scrap_1);
  gameEngine.addEntity(scrap_2);
  gameEngine.addEntity(scrap_3);
  gameEngine.addEntity(scrap_4);

  gameEngine.addEntity(light_0);
  gameEngine.addEntity(light_1);
  gameEngine.addEntity(light_2);
  gameEngine.addEntity(light_3);
  gameEngine.addEntity(light_4);

  gameEngine.addEntity(lever_0);

  gameEngine.addEntity(plate_0);

  gameEngine.addEntity(kid);

  gameEngine.addEntity(end);

    boxes.push(box1_0);
    boxes.push(box1_1);
    boxes.push(box1_2);
    boxes.push(box1_3);

    boxes.push(box2_0);
    boxes.push(box2_1);
    boxes.push(box2_2);
    boxes.push(box2_3);
    boxes.push(box2_4);
    boxes.push(box2_5);
    boxes.push(box2_6);
    boxes.push(box2_7);
    boxes.push(box2_8);

    boxes.push(plat1_0);
    boxes.push(plat1_1);
    boxes.push(plat1_2);

    boxes.push(plat2_0);
    boxes.push(plat2_1);

    boxes.push(scrap_0);
    boxes.push(scrap_1);
    boxes.push(scrap_2);
    boxes.push(scrap_3);
    boxes.push(scrap_4);

    boxes.push(light_0);
    boxes.push(light_1);
    boxes.push(light_2);
    boxes.push(light_3);
    boxes.push(light_4);

    boxes.push(lever_0);

    boxes.push(plate_0);

    boxes.push(kid);

    boxes.push(end);

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

var music = ASSET_MANAGER.sounds.pop();
