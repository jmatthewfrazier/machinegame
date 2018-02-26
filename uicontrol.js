function pushText(text, elementID){
	ASSET_MANAGER.getAsset("./asset_lib/audio/talking.wav").play();
	setText(text, elementID);
	display(1, elementID);
	hide(4000, 2000, "dialogue");
}

function talk(text, entity, height, ctx){
	ctx.fillText(text, entity.x, entity.y + height);
}

function setText(text, elementID) {
	let em = document.getElementById(elementID);
	em.innerHTML = text;
	em.style.opacity=0;
}

function display(op, elementID) {
	var em = document.getElementById(elementID);
	em.style.display= "block";
    em.style.opacity = op;
}

function setFSize(elementID, size){
	document.getElementById(elementID).style.fontSize = size;
}

function hide(time, wait, elementID){
	let em = document.getElementById(elementID);
	setTimeout(function() {
    	em.style.opacity = 0;
    	setTimeout(function() {
    		em.style.display = "none";
				setFSize("dialogue", "170%");
  		}, wait);
  	}, time);
}

window.onload = function(){
	const canvas = document.getElementById("gameWorld");
	canvas.onblur = function() {
		canvas.focus();
	}
}
