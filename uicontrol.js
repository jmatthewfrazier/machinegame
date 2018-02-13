function pushText(text, timeMS, elementID){
	setText(text, elementID);
	displayText(elementID);
	hide(time, elementID);
}

function setText(text, elementID) {
	let em = document.getElementById(elementID);
	em.innerHTML = text;
	em.style.opacity=0;
}

function displayText(elementID) {
	var em = document.getElementById(elementID);
	em.style.display= "block";
    em.style.opacity = 1;
}

function hide(time, elementID){
	let em = document.getElementById(elementID);
	setTimeout(function() {
    	em.style.opacity = 0;
  	}, time);
	setTimeout(function() {
    	em.style.display = "none";
    	em.innerHTML = null;
  	}, time + 4000);
}