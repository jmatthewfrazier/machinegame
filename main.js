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
    return (this.right >= oth.left && this.left <= oth.right && this.top <= oth.bottom && this.bottom >= oth.top);
}

BoundingBox.prototype.collideLightning = function (oth) {
  return ((this.right > oth.left && this.left < oth.right) || (this.right > oth.right && this.left < oth.left));
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
          fadeAudio(ASSET_MANAGER.getAsset("./asset_lib/audio/Reach for the Dead.mp3"), 0);
          display(0.7, "pause");
            music.muted = false;
            if ($("#muteMusic").is(':checked')){
              music.muted = true;
            }
            display(0.9, "pause");
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
        	ctx.fillText("click to begin", window.innerWidth/gameEngine.yscale/2, window.innerHeight/gameEngine.yscale/2);
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
    for (i = -8000; i <= 2*window.innerHeight/gameEngine.xscale; i += window.innerHeight/gameEngine.xscale -5){
      ctx.drawImage(ASSET_MANAGER.getAsset(bg.layer0), 0, i, window.innerWidth/gameEngine.xscale, window.innerHeight/gameEngine.xscale);
  		ctx.drawImage(ASSET_MANAGER.getAsset(bg.layer1), 0, i);
    }
  }
}

// the "main" code begins here
var gameEngine = new GameEngine();
var ASSET_MANAGER = new AssetManager();

function level_1(gameEngine){
  gameEngine.level = 1;
    var statics = [
        new Plat3(gameEngine, 0, 700, 350, 87, 1),
      //BOX 1 (PUSHING)
        new Box1(gameEngine, 500, 630, 144, 144),
        new Box1(gameEngine, 1678, 630, 144, 144),
        new Box1(gameEngine, 4900, 630, 144, 144),
        new Box1(gameEngine, 5950, 630, 144, 144),
        new Box1(gameEngine, 7000, 630, 144, 144),
      //BOX 2 (NO PUSH)
        // new Box2(gameEngine, 300, 627, 144, 144),
        // new Box2(gameEngine, 700, 555, 144, 144),
        // new Box2(gameEngine, 700, 627, 144, 144),
        new Box2(gameEngine, 3800, 627, 144, 144),
        new Box2(gameEngine, 6200, 627, 144, 144),
        new Box2(gameEngine, 6200, 555, 144, 144),
        new Box2(gameEngine, 6372, 555, 144, 144),
        new Box2(gameEngine, 6372, 627, 144, 144),
        new Box2(gameEngine, 6372, 483, 144, 144),
      //PLAT1
        new Plat1(gameEngine, 800, 560, 553, 92),
        new Plat1(gameEngine, 1700, 560, 553, 92),
        new Plat1(gameEngine, 3950, 560, 553, 92),
      //PLAT2
        new Plat2(gameEngine, 5275, 600, 553, 92),
        new Plat2(gameEngine, 5500, 500, 553, 92),
      //SCRAP METAL
        new Ouchies(gameEngine, 1400, 640, 192, 192,"./img/scrap.png"),
        new Ouchies(gameEngine, 2390, 640, 192, 192,"./img/scrap.png"),
        new Ouchies(gameEngine, 2740, 640, 192, 192,"./img/scrap.png"),
        new Ouchies(gameEngine, 3550, 640, 192, 192,"./img/scrap.png"),
        new Ouchies(gameEngine, 4510, 640, 192, 192,"./img/scrap.png"),
      //LIGHTNING
        new Lightning(gameEngine, 1212, 0, 192, 768),
        new Lightning(gameEngine, 10, 0, 192, 768),
        new Lightning(gameEngine, 4358, 0, 192, 768),
        new Lightning(gameEngine, 4725, 0, 192, 768),
        new Lightning(gameEngine, 2500, 0, 192, 768),
      //NPC
        new Character(gameEngine, "./img/kid_talk_l.png", 400, 620, 192, 192, "Do you know who woke the machine?"),
        new Character(gameEngine, "./img/kid_talk_l.png", 6300, 620, 192, 192, "if you get stuck, push x to restart the level"),
        new EndLevel(gameEngine, 7700, 620, 500, 500)
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
    gameEngine.text = [
      "Usually it creaked but today it roared",
      "The Machine, great protector of the land",
      "It struck our humble land in anger",
      "Glorius monument turned wicked ",
      "Save this land. for all of us"
      ];
    gameEngine.flags = [
      false,
      false,
      false,
      false,
      false
    ];
    set_level(gameEngine, statics);
}

function level_2(gameEngine){
  gameEngine.level = 2;
  var statics = [
  new Box1(gameEngine, 600, 630, 144, 144),
  new Box1(gameEngine, 5900, 630, 144, 144),
  new Box1(gameEngine, 1600, 630, 144, 144),
  new Box1(gameEngine, 3500, 630, 144, 144),
  new Box1(gameEngine, 6170, 445, 144, 144),

  // new Box1(gameEngine, 5900, 627, 144, 144),

  //BOX 2 (NO PUSH)
  new Box2(gameEngine, 3650, 555, 144, 144),
  new Box2(gameEngine, 3650, 627, 144, 144),

  new Box2(gameEngine, 3850, 555, 144, 144),
  new Box2(gameEngine, 3850, 627, 144, 144),

  new Box2(gameEngine, 4300, 627, 144, 144),
  new Box2(gameEngine, 5100, 627, 144, 144),

  new Box2(gameEngine, 700, 555, 144, 144),
  new Box2(gameEngine, 700, 627, 144, 144),

  // new Box2(gameEngine, 5800, 627, 144, 144),
  // new Box2(gameEngine, 6100, 627, 144, 144),
  //

  new Plat1(gameEngine, 4350, 550, 553, 92),
  new Plat1(gameEngine, 6100, 620, 553, 92),
  new Plat1(gameEngine, 6150, 540, 553, 92),
  //
  // new Box1(gameEngine, 295, 415, 144, 144),
  // //PLAT2
  new Plat2(gameEngine, 800, 540, 553, 92),
  new Plat2(gameEngine, 950, 470, 553, 92),
  new Plat2(gameEngine, 1100, 390, 553, 92),

  new Plat2(gameEngine, 5200, 550, 553, 92),
  //SCRAP METAL
  new Ouchies(gameEngine, 1050, 640, 192, 192,"./img/scrap.png"),
  new Ouchies(gameEngine, 1100, 640, 192, 192,"./img/electric.png"),
  new Ouchies(gameEngine, 1150, 640, 192, 192,"./img/scrap.png"),
  new Ouchies(gameEngine, 1200, 640, 192, 192,"./img/electric.png"),
  new Ouchies(gameEngine, 1250, 640, 192, 192,"./img/scrap.png"),
  new Ouchies(gameEngine, 1300, 640, 192, 192,"./img/electric.png"),
  new Ouchies(gameEngine, 1350, 640, 192, 192,"./img/scrap.png"),
  new Ouchies(gameEngine, 2200, 640, 192, 192,"./img/scrap.png"),
  new Ouchies(gameEngine, 3250, 640, 192, 192,"./img/electric.png"),

  new Ouchies(gameEngine, 3760, 640, 192, 192,"./img/electric.png"),
  new Ouchies(gameEngine, 3560, 640, 192, 192,"./img/electric.png"),

  new Ouchies(gameEngine, 4450, 640, 192, 192,"./img/electric.png"),
  new Ouchies(gameEngine, 4500, 640, 192, 192,"./img/electric.png"),
  new Ouchies(gameEngine, 4550, 640, 192, 192,"./img/electric.png"),


  //WALL
  new Ouchies(gameEngine, 4335, 620, 192, 192,"./img/electric_wall_l.png"),
  new Ouchies(gameEngine, 5040, 620, 192, 192,"./img/electric_wall_r.png"),

  //LIGHTNING
  // new Lightning(gameEngine, 1500, 0, 192, 768),
  // new Lightning(gameEngine, 1600, 0, 192, 768),
  new Lightning(gameEngine, 4750, 0, 192, 768),
  new Lightning(gameEngine, 4650, 0, 192, 768),
  new Lightning(gameEngine, 4850, 0, 192, 768),
  new Lightning(gameEngine, 5700, 0, 192, 768),

  //LIGHTNING

  //NPC
  new Character(gameEngine, "./img/old_talk_l.png", 400, 620, 192, 192, "please help my dog!"),
  new Character(gameEngine, "./img/dog_excited_l.png", 2350, 635, 192, 192, "woof woof!"),
  new Character(gameEngine, "./img/dwight_talk_l.png", 7100, 620, 192, 192, "The entrance to the machine is near"),

  new EndLevel(gameEngine, 7400, 620, 500, 500),
  new Plat3(gameEngine, 0, 700, 350, 50, 2)
  ];
  //LEVER
    var lever_0 = new Lever(gameEngine, 3111, 575, 192, 192);
    var door_0 = new Door(gameEngine, 3300, 525, 192, 192, lever_0);

    var lever_1 = new Lever(gameEngine, 6200, 415, 192, 192);
    var door_1 = new Door(gameEngine, 6600, 525, 192, 192, lever_1);
  //PLATE
    var plate_0 = new Plate(gameEngine, 5500, 605, 192, 192);
    var door_2 = new Door(gameEngine, 7300, 520, 192, 192, plate_0);

    statics.push(lever_0);
    statics.push(lever_1);
    statics.push(plate_0);
    statics.push(door_0);
    statics.push(door_1);
    statics.push(door_2);
  for (var i = 1; i < 50; i++) {
    if (i !== 3 && i !== 7 && i !== 15 && i !== 20) {
      statics.unshift(new Plat3(gameEngine, i * (349 * .75), 700, 350, 50, 2));
    }
  }
  gameEngine.Background.layer0 = "./img/L2_layer0.png";
  gameEngine.Background.layer1 = "./img/L2_layer1.png";
  var vol = music.volume;
  music = ASSET_MANAGER.getAsset("./asset_lib/audio/In_Your_Prime_OC.mp3");
  music.volume = vol;
  gameEngine.text = [
    "The city wept as its people died",
    "Now withering as quickly as it once grew",
    "The Machine carved a valley into its face",
    "Goodbye, ocean of dunes",
    "And welcome to the glimmering pinnacle"
    ];
  gameEngine.flags = [
    false,
    false,
    false,
    false,
    false
  ];
  set_level(gameEngine, statics);
}

function level_3(gameEngine){
  gameEngine.level = 3;
  var statics = [

      // new Box1(gameEngine, 875, 387, 144, 144),
      // new Box2(gameEngine, 1000, 387, 144, 144),
      new Box1(gameEngine, 180, 20, 144, 144),

      new Plat1(gameEngine, 700, 320, 553, 92),
      new Plat1(gameEngine, 900, 380, 553, 92),

      new Plat2(gameEngine, 100, -100, 553, 92),

      new Ouchies(gameEngine, 700, 400, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 800, 400, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 900, 400, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 1000, 400, 192, 192, "./img/electric.png"),

      new Ouchies(gameEngine, 860, 190, 192, 192, "./img/scrap.png"),
      new Ouchies(gameEngine, 660, 110, 192, 192, "./img/scrap.png"),
      new Ouchies(gameEngine, 460, 30, 192, 192, "./img/scrap.png"),

      // new Box2(gameEngine, 1300, 387, 144, 144),
      new Box2(gameEngine, 100, 20, 144, 144),
      new Box2(gameEngine, 100, -52, 144, 144),

      new Box2(gameEngine, 650, -530, 144, 144),
      new Box2(gameEngine, 500, -450, 144, 144),
      new Box2(gameEngine, 250, -370, 144, 144),
      new Ouchies(gameEngine, 440, -450, 192, 192, "./img/electric_wall_r.png"),
      //

      new Ouchies(gameEngine, 900, -520, 192, 192, "./img/scrap.png"),
      new Ouchies(gameEngine, 1000, -520, 192, 192, "./img/scrap.png"),
      new Ouchies(gameEngine, 1100, -520, 192, 192, "./img/scrap.png"),

      new Box1(gameEngine, 1200, -520, 144, 144),

      new Plat1(gameEngine, 700, -600, 553, 92),
      new Plat1(gameEngine, 900, -680, 553, 92),

      new Ouchies(gameEngine, 900, -820, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 1000, -820, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 1100, -820, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 800, -820, 192, 192, "./img/electric.png"),
      new Ouchies(gameEngine, 700, -820, 192, 192, "./img/electric.png"),

      // new Box2(gameEngine, 500, -830, 144, 144),
      // new Box2(gameEngine, 500, -902, 144, 144),
      new Box1(gameEngine, 600, -830, 144, 144),
      new Box1(gameEngine, 550, -990, 144, 144),
      new Character(gameEngine, "./img/grrl_talk_l.png", 1220, 390, 192, 192, "You must make it to the top"),
      new Character(gameEngine, "./img/tall_talk_l.png", 1220, -840, 192, 192, "Go through that door to stop the machine!"),
      new EndLevel(gameEngine, 50, -1040, 100, 200),
      new Plat3(gameEngine, 0, 700, 350, 87)
  ];
  var lever_0 = new Lever(gameEngine, 220, -30, 192, 192);
  var door_0 = new Door(gameEngine, 700, -640, 192, 192, lever_0);

  var plate_0 = new Plate(gameEngine, 350, -970, 192, 192);
  var door_1 = new Door(gameEngine, 100, -1050, 192, 192, plate_0);
  //PLATE
  statics.push(lever_0);
  // statics.push(door_0);
  statics.push(plate_0);
  statics.push(door_1);
  for (var i = 1; i < 4; i++) {
    statics.unshift(new Plat3(gameEngine, (i * 200), 700 - (i * 80), 350, 87));
  }
  for (var j = 0; j < 3; j++) {
    statics.unshift(new Plat3(gameEngine, (860 + j * 175), 459, 350, 87));
  }
  for (var y = 0; y < 3; y++) {
    statics.unshift(new Plat3(gameEngine, 800 - (y * 200), 250 - (y * 80), 350, 87));
  }
  statics.unshift(new Plat3(gameEngine, 800 - (3 * 200) - 100, 250 - (2 * 80) , 350, 87));
  for (var i = 0; i < 3; i++) {
    statics.unshift(new Plat3(gameEngine, 200 + (i * 200), -300 - (i * 80), 350, 87));
  }
  for (var i = 0; i < 2; i++) {
    statics.unshift(new Plat3(gameEngine, 1100 - (i * 200), -300 - (2 * 80), 350, 87));
  }
  for (var i = 0; i < 4; i++) {
    statics.unshift(new Plat3(gameEngine, 1100 - (i * 200), -600 - (2 * 80), 350, 87));
  }
  for (var i = 0; i < 4; i++) {
    statics.unshift(new Plat3(gameEngine, 500 - (i * 200), -720 - (2 * 80), 350, 87));
  }
  gameEngine.Background.layer0 = "./img/Hallway.bmp";
  gameEngine.Background.layer1 = "./img/layer1_dummy.png";
  gameEngine.Background.vertical = true;
  var vol = music.volume;
  music = ASSET_MANAGER.getAsset("./asset_lib/audio/Atomyk Ebonpyre.mp3");
  music.volume = vol;
  gameEngine.Hero.y = -1200;
  gameEngine.Hero.x = 300
  gameEngine.text = [
    "Stew in its belly",
    "That's all you are",
    "It never cared for this land",
    "So it tears it apart",
    "And you along with it"
    ];
  gameEngine.flags = [
    false,
    false,
    false,
    false,
    false
  ];
  // gameEngine.Hero.y = 400;
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

function continue_dl(){
  ASSET_MANAGER.downloadQueue = [];
  ASSET_MANAGER.successCount = 0;
  ASSET_MANAGER.errorCount = 0;
  ASSET_MANAGER.queueDownload("./asset_lib/audio/Atomyk Ebonpyre.mp3");
  ASSET_MANAGER.queueDownload("./asset_lib/audio/In_Your_Prime_OC.mp3");

  ASSET_MANAGER.queueDownload("./img/L2_layer0.png");
  ASSET_MANAGER.queueDownload("./img/L2_layer1.png");
  ASSET_MANAGER.queueDownload("./img/Hallway.bmp");
  ASSET_MANAGER.queueDownload("./img/layer1_dummy.png");
  ASSET_MANAGER.queueDownload("./img/level_2_ground.png");
  ASSET_MANAGER.queueDownload("./img/electric.png");
  ASSET_MANAGER.queueDownload("./img/electric_wall_l.png");
  ASSET_MANAGER.queueDownload("./img/electric_wall_r.png");
  ASSET_MANAGER.queueDownload("./img/dog_excited_l.png");
  ASSET_MANAGER.queueDownload("./img/dog_walk.png");
  ASSET_MANAGER.queueDownload("./img/dog_wait.png");

  ASSET_MANAGER.downloadAll(function(){
    console.log("downloads complete\n");
  });
}

ASSET_MANAGER.queueDownload("./img/box1.png");
ASSET_MANAGER.queueDownload("./img/box2.png");
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
ASSET_MANAGER.queueDownload("./img/tall_talk_l.png");
ASSET_MANAGER.queueDownload("./img/grrl_talk_l.png");
ASSET_MANAGER.queueDownload("./img/dwight_talk_l.png");
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
ASSET_MANAGER.queueDownload("./asset_lib/audio/talking.wav");
ASSET_MANAGER.queueDownload("./asset_lib/audio/jump.wav");

//MUSIC LAST
ASSET_MANAGER.queueDownload("./asset_lib/audio/Reach for the Dead.mp3");
ASSET_MANAGER.queueDownload("./asset_lib/audio/Aquatic_Ambiance_2.mp3");
// ASSET_MANAGER.queueDownload("./img/gear.png");

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
    continue_dl();
});

var intro = ASSET_MANAGER.getAsset("./asset_lib/audio/Reach for the Dead.mp3");
var music = ASSET_MANAGER.getAsset("./asset_lib/audio/Aquatic_Ambiance_2.mp3");
