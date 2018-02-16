function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
    this.sounds = [];
}

AssetManager.prototype.queueDownload = function (path) {
    console.log("Queueing " + path);
    this.downloadQueue.push(path);
}

AssetManager.prototype.isDone = function () {
    return this.downloadQueue.length === this.successCount + this.errorCount;
}

AssetManager.prototype.downloadAll = function (callback) {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var item = 0;
        var that = this;
        var load = "load";
        var path = this.downloadQueue[i];
        console.log(path);

        if (fileType(path) === "audio"){
            item = new Audio();
            load = "loadeddata";
        } else if (fileType(path) === "img"){
            item = new Image();
        }

        item.addEventListener(load, function () {
            console.log("Loaded " + this.src);
            that.successCount++;
            if(that.isDone()) callback();
        });

        item.addEventListener("error", function () {
            console.log("Error loading " + this.src);
            that.errorCount++;
            if (that.isDone()) callback();
        });

        item.src = path;
        if (fileType(path) === "audio"){
          this.sounds.push(item);
        }
        this.cache[path] = item;
    }
}

AssetManager.prototype.getAsset = function (path) {
    return this.cache[path];
}

function fileType (filePath){
    let filename = filePath.split('.');
    let ext = filename[filename.length - 1];
    var type = "other";
    switch(ext) {
        case "jpg":
            type = "img";
            break;
        case "png":
            type = "img";
            break;
        case "bmp":
            type = "img";
            break;
        case "wav":
            type = "audio";
            break;
        case "mp3":
            type = "audio";
            break;
        default:
            type = "other";
            break;
    }
    return type;
}
