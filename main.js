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
    music.muted = true;
}

PlayGame.prototype.update = function () {
    if (this.game.click){
        if(!this.game.running){
            music.muted = false;
            if ($("#muteMusic").is(':checked')){
              music.muted = true;
            }
            music.volume = 0.5;
            music.loop = true;
            music.play();
        }
    	this.game.running = true;
    	// hide(0, 2000, "dialogue");
      setTimeout(function () {
        setFSize("dialogue", "170%");
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
        	ctx.fillText("click to begin", this.x + 100, this.y);
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
  this.vertical = false;
  this.layer0 = "./img/Image_0005.jpg";
  this.layer1 = "./img/Image_0009.png";
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
    if (this.x < 0) this.x = 700;
  }


    Entity.prototype.update.call(this);
}

Background.prototype.draw = function (ctx) {
	let fillNum = (8000/700) + 2;
  let x = 0 - 700;
	let y = this.y;
  let bg = this;
  ctx.imageSmoothingEnabled = false;
  if (!this.vertical){
    let ay = window.innerHeight/gameEngine.yscale - ASSET_MANAGER.getAsset(this.layer1).height;
  	for (i = 0; i < fillNum; i++){
  		ctx.drawImage(ASSET_MANAGER.getAsset(bg.layer0), x, y, ASSET_MANAGER.getAsset(bg.layer0).width, window.innerHeight/gameEngine.yscale);
  		ctx.drawImage(ASSET_MANAGER.getAsset(bg.layer1), x, ay);
  		x += 700;
  	}
  } else {
    for (i = -8000; i <= 2*window.innerHeight/gameEngine.yscale; i += window.innerHeight/gameEngine.yscale - 5){
      ctx.drawImage(ASSET_MANAGER.getAsset(bg.layer0), 0, i, window.innerWidth/gameEngine.yscale, window.innerHeight/gameEngine.yscale);
  		ctx.drawImage(ASSET_MANAGER.getAsset(bg.layer1), 0, i);
    }
  }
}

// the "main" code begins here
var gameEngine = new GameEngine();
var ASSET_MANAGER = new AssetManager();

function level_1(gameEngine){
    var statics = [
      //BOX 1 (PUSHING)
        new Box1(gameEngine, 500, 627, 144, 144),
        new Box1(gameEngine, 1678, 627, 144, 144),
        new Box1(gameEngine, 4900, 627, 144, 144),
        new Box1(gameEngine, 5950, 627, 144, 144),
        new Box1(gameEngine, 7000, 627, 144, 144),
      //BOX 2 (NO PUSH)
        new Box2(gameEngine, 300, 627, 144, 144),
        new Box2(gameEngine, 700, 555, 144, 144),
        new Box2(gameEngine, 700, 627, 144, 144),
        new Box2(gameEngine, 3800, 627, 144, 144),
        new Box2(gameEngine, 6200, 627, 144, 144),
        new Box2(gameEngine, 6200, 555, 144, 144),
        new Box2(gameEngine, 6372, 555, 144, 144),
        new Box2(gameEngine, 6372, 627, 144, 144),
        new Box2(gameEngine, 6372, 483, 144, 144),
      //PLAT1
        new Plat1(gameEngine, 800, 540, 553, 92),
        new Plat1(gameEngine, 1700, 540, 553, 92),
        new Plat1(gameEngine, 3950, 540, 553, 92),
      //PLAT2
        new Plat2(gameEngine, 5275, 600, 553, 92),
        new Plat2(gameEngine, 5500, 500, 553, 92),
      //SCRAP METAL
        new ScrapMetal(gameEngine, 1400, 640, 192, 192),
        new ScrapMetal(gameEngine, 2390, 640, 192, 192),
        new ScrapMetal(gameEngine, 2740, 640, 192, 192),
        new ScrapMetal(gameEngine, 3550, 640, 192, 192),
        new ScrapMetal(gameEngine, 4510, 640, 192, 192),
      //LIGHTNING
        new Lightning(gameEngine, 1212, 0, 192, 768),
        new Lightning(gameEngine, 4200, 0, 192, 768),
        new Lightning(gameEngine, 4358, 0, 192, 768),
        new Lightning(gameEngine, 4725, 0, 192, 768),
        new Lightning(gameEngine, 2500, 0, 192, 768),
      //NPC
        new Character(gameEngine, "./img/kid_talk_l.png", 400, 620, 192, 192, "see that grey box? try pushing it"),
        new Character(gameEngine, "./img/kid_talk_l.png", 6300, 620, 192, 192, "if you get stuck, push x to restart the level"),
        new EndLevel(gameEngine, 73, 620, 500, 500),
        new Plat3(gameEngine, 0, 700, 350, 87, 1)
    ];
    //LEVER
      var lever_0 = new Lever(gameEngine, 3111, 575, 192, 192);
      var door_0 = new Door(gameEngine, 3300, 525, 192, 192, lever_0);
    //PLATE
      var plate_0 = new Plate(gameEngine, 6800, 605, 192, 192);
      var door_1 = new Door(gameEngine, 7200, 520, 192, 192, plate_0);
      statics.push(lever_0);
      statics.push(door_0);
      statics.push(plate_0);
      statics.push(door_1);
    for (var i = 1; i < 50; i++) {
      if (i !== 3 && i !== 7 && i !== 15 && i !== 20) {
        statics.unshift(new Plat3(gameEngine, i * (349 * .75), 700, 350, 87, 1));
      }
    }
    set_level(gameEngine, statics);
}

function level_2(gameEngine){
  var statics = [
  new Box1(gameEngine, 600, 627, 144, 144),
  new Box1(gameEngine, 3800, 627, 144, 144),
//BOX 2 (NO PUSH)
  new Box2(gameEngine, 700, 555, 144, 144),
  new Box2(gameEngine, 700, 627, 144, 144),
  new Box2(gameEngine, 1095, 627, 144, 144),
//


new Plat1(gameEngine, 215, 485, 553, 92),

new Box1(gameEngine, 295, 415, 144, 144),
// //PLAT2
  new Plat1(gameEngine, 800, 540, 553, 92),
  new Plat1(gameEngine, 1100, 470, 553, 92),
  new Plat1(gameEngine, 1400, 390, 553, 92),
//
  new ScrapMetal(gameEngine, 1025, 640, 192, 192),
  new ScrapMetal(gameEngine, 1150, 640, 192, 192),
  new ScrapMetal(gameEngine, 1250, 640, 192, 192),
  new ScrapMetal(gameEngine, 1350, 640, 192, 192),
  new ScrapMetal(gameEngine, 1450, 640, 192, 192),
  new ScrapMetal(gameEngine, 1550, 640, 192, 192),
  new ScrapMetal(gameEngine, 1650, 640, 192, 192),


  new Lightning(gameEngine, 2100, 0, 192, 192),

  new Character(gameEngine, "./img/dog_excited_l.png", 2500, 635, 192, 192, "woof"),
  new Lightning(gameEngine, 3450, 0, 192, 768),
  new Lightning(gameEngine, 3575, 0, 192, 768),
  new Lightning(gameEngine, 3650, 0, 192, 768),
// new Lightning(gameEngine, 500, 0, 192, 768),
// new Lightning(gameEngine, 600, 0, 192, 768),
//SCRAP METAL
//LIGHTNING
//NPC
  // new Character(gameEngine, "./img/old_talk_l.png", 400, 620, 192, 192, "hey sonny!"),
  new EndLevel(gameEngine, 7000, 620, 500, 500),
  new Plat3(gameEngine, 0, 700, 350, 50, 2)
  ];
  //LEVER
    var lever_0 = new Lever(gameEngine, 3111, 575, 192, 192);
    var door_0 = new Door(gameEngine, 3300, 525, 192, 192, lever_0);
  //PLATE
    var plate_0 = new Plate(gameEngine, 4000, 605, 192, 192);
    var door_1 = new Door(gameEngine, 4500, 520, 192, 192, plate_0);
    statics.push(lever_0);
    statics.push(door_0);
    statics.push(plate_0);
    statics.push(door_1);
  for (var i = 1; i < 50; i++) {
    if (i !== 3 && i !== 7 && i !== 15 && i !== 20) {
      statics.unshift(new Plat3(gameEngine, i * (349 * .75), 700, 350, 50, 2));
    }
  }
  gameEngine.Background.layer0 = "./img/L2_layer0.png";
  gameEngine.Background.layer1 = "./img/L2_layer1.png";
  music = ASSET_MANAGER.getAsset("./asset_lib/audio/In_Your_Prime_OC.mp3");
  set_level(gameEngine, statics);
}

function level_3(gameEngine){
  var statics = [

      new Box1(gameEngine, 875, 387, 144, 144),
      new Box2(gameEngine, 1000, 387, 144, 144),
      new Box2(gameEngine, 1000, 315, 144, 144),

      new ScrapMetal(gameEngine, 800, 400, 192, 192),
      new ScrapMetal(gameEngine, 1050, 400, 192, 192),
      new ScrapMetal(gameEngine, 1100, 400, 192, 192),


      new Character(gameEngine, "./img/tall_talk_l.png", 900, 375, 192, 192, "please help!", "tall"),
      new EndLevel(gameEngine, 7700, 620, 500, 500),
      new Plat3(gameEngine, 0, 700, 350, 87)
  ];
  var lever_0 = new Lever(gameEngine, 1000, 340, 192, 192);
  var door_0 = new Door(gameEngine, 1200, 300, 192, 192, lever_0);
//PLATE
  statics.push(lever_0);
  statics.push(door_0);
  for (var i = 1; i < 4; i++) {
    statics.unshift(new Plat3(gameEngine, (i * 200), 700 - (i * 80), 350, 87));
  }
  for (var j = 0; j < 3; j++) {
    statics.unshift(new Plat3(gameEngine, (860 + j * 175), 459, 350, 87));
  }
  for (var i = 1; i < 4; i++) {
    statics.unshift(new Plat3(gameEngine, 900 - (i * 200), 315 - (i * 80), 350, 87));
  }
  gameEngine.Background.layer0 = "./img/Hallway.bmp";
  gameEngine.Background.layer1 = "./img/layer1_dummy.png";
  gameEngine.Background.vertical = true;
  music = ASSET_MANAGER.getAsset("./asset_lib/audio/Atomyk Ebonpyre.mp3");
  set_level(gameEngine, statics);
}

function set_level(gameEngine, statics){
  boxes = [];
  gameEngine.addEntity(gameEngine.Background);
  statics.forEach(function(entity){
    gameEngine.addEntity(entity);
    boxes.push(entity);
  });
  gameEngine.boxes = boxes;
  if(gameEngine.Hero){
    gameEngine.addEntity(gameEngine.Hero);
  }
  gameEngine.playState.reset();
  gameEngine.addEntity(gameEngine.playState);
}

function nextLevel(gameEngine){
  gameEngine.resetandHide();
  if (gameEngine.lvl == 1){
    gameEngine.clear();
    level_2(gameEngine);
    setText("Concourse", "dialogue");
  	display(1, "dialogue");
    hide(2000, 2000, "dialogue");
    gameEngine.lvl++;
  } else if (gameEngine.lvl == 2){
    gameEngine.clear();
    level_3(gameEngine);
    setText("Interior", "dialogue");
  	display(1, "dialogue");
    hide(2000, 2000, "dialogue");
    gameEngine.lvl++;
  }
}

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
ASSET_MANAGER.queueDownload("./img/pc_push.png");
ASSET_MANAGER.queueDownload("./img/pc_push_l.png");
ASSET_MANAGER.queueDownload("./img/kid_talk_l.png");
ASSET_MANAGER.queueDownload("./img/old_talk_l.png");
ASSET_MANAGER.queueDownload("./img/dog_excited_l.png");
ASSET_MANAGER.queueDownload("./img/dog_walk.png");
ASSET_MANAGER.queueDownload("./img/dog_wait.png");
ASSET_MANAGER.queueDownload("./img/tall_talk_l.png");
ASSET_MANAGER.queueDownload("./img/Image_0005.jpg");
ASSET_MANAGER.queueDownload("./img/Image_0009.png");
ASSET_MANAGER.queueDownload("./img/Image_0010.png");
ASSET_MANAGER.queueDownload("./img/L2_layer0.png");
ASSET_MANAGER.queueDownload("./img/L2_layer1.png");
ASSET_MANAGER.queueDownload("./img/Hallway.bmp");
ASSET_MANAGER.queueDownload("./img/layer1_dummy.png");
ASSET_MANAGER.queueDownload("./img/woodplat.png");
// ASSET_MANAGER.queueDownload("./img/woodplat copy.png");
ASSET_MANAGER.queueDownload("./img/lightning.png");
ASSET_MANAGER.queueDownload("./img/scrap.png");
ASSET_MANAGER.queueDownload("./img/plate.png");
ASSET_MANAGER.queueDownload("./img/plate_rev.png");
ASSET_MANAGER.queueDownload("./img/lever.png");
ASSET_MANAGER.queueDownload("./img/lever_still.png");
ASSET_MANAGER.queueDownload("./img/lever_still_rev.png");
ASSET_MANAGER.queueDownload("./img/door_open.png");
ASSET_MANAGER.queueDownload("./img/door_closed.png");
ASSET_MANAGER.queueDownload("./img/level_2_ground.png");
ASSET_MANAGER.queueDownload("./asset_lib/audio/lightning.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/explosion.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/solved.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/ded.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/step.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/talking.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/jump.wav");

//MUSIC LAST
ASSET_MANAGER.queueDownload("./asset_lib/audio/Atomyk Ebonpyre.mp3");
ASSET_MANAGER.queueDownload("./asset_lib/audio/In_Your_Prime_OC.mp3");
ASSET_MANAGER.queueDownload("./asset_lib/audio/Aquatic_Ambiance_2.mp3");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var bg = new Background(gameEngine);
    var pg = new PlayGame(gameEngine, (canvas.width/2), (canvas.height/2));
    gameEngine.Background = bg;
    gameEngine.playState = pg;
    gameEngine.lvl = 1;
    level_1(gameEngine);
    var unicorn = new Unicorn(gameEngine);
    gameEngine.Hero = unicorn;
    gameEngine.addEntity(gameEngine.Hero);

    setText("THE MACHINE", "dialogue");
  	display(1, "dialogue");

    gameEngine.init(ctx);
    gameEngine.start();
});

var music = ASSET_MANAGER.getAsset("./asset_lib/audio/Aquatic_Ambiance_2.mp3");
//REMOVE MUSIC FROM SOUNDS LIST!!!
ASSET_MANAGER.sounds.pop();
ASSET_MANAGER.sounds.pop();
