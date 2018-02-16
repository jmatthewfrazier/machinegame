
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
    this.paused = false;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    if (this.paused){
        gameDelta = 0;
    }
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.action = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.running = false;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');
    var that = this;

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);
        }

        return { x: x, y: y };
    }

    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = true;
        if (String.fromCharCode(e.which) === 'E') that.action = true;
        if (String.fromCharCode(e.which) === 'D') {
          that.right = true;
          that.rightScroll = true;
        } else if (String.fromCharCode(e.which) === 'A') {
          that.left = true;
          that.leftScroll = true;
        }else if (String.fromCharCode(e.which) === 'X') {
          that.reset();
          if (that.timer.paused){
            that.togglePause();
          }
        } else if (e.keyCode === 27) {
          that.togglePause();
        }

//        console.log(e);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = false;
        if (String.fromCharCode(e.which) === 'D') that.right = false;
        if (String.fromCharCode(e.which) === 'A') that.left = false;
      //  if (String.fromCharCode(e.which) === 'E') that.action = false;


//        console.log(e);
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        this.running = true;
        hide(0, 2000, "dialogue");
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
      that.mouse = getXandY(e);
      if(that.mouse['x'] > 1000){
        // pushText("great", 4000, "dialogue");
      }
    }, false);

    this.ctx.canvas.addEventListener("mouseleave", function (e) {
      that.mouse = null;
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.reset = function () {
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].reset();
    }
}

GameEngine.prototype.resetandHide = function(){
    this.reset();
    this.togglePause();
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}



GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if (this.clockTick > 0){
        this.update();
        this.draw();
        this.space;
        this.right;
        this.left;
        this.mouse;
        this.click;
        this.action;
        this.leftScroll;
        this.rightScroll;
    }
}

GameEngine.prototype.togglePause = function () {
    if (this.timer.paused){
        hide(20, 20, "menu");
        document.getElementById("gameWorld").focus();
        this.timer.paused = false;
    } else {
        this.timer.paused = true;
        display(0.8, "menu");
    }
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.reset = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
