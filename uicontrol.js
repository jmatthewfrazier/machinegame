function pushText(text, timeMS, elementID){
	setText(text, elementID);
	displayText(1, elementID);
	hide(time, 2000, elementID);
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

function hide(time, wait, elementID){
	let em = document.getElementById(elementID);
	setTimeout(function() {
    	em.style.opacity = 0;
  	}, time);
	setTimeout(function() {
    	em.style.display = "none";
  	}, time + wait);
}