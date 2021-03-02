function changeColor() {
    document.getElementById('button').style.color = 'red';
    document.getElementById('ausgabe').textContent = "GG";
}

function getRandomPosition(element) {
	var y = window.innerHeight-element.clientHeight;
	var x = window.innerWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x);
	var randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}

function changePosition() {
    var xy = getRandomPosition(document.getElementById('button')); 
    document.getElementById("button").style.left = xy[0] + 'px';
    document.getElementById("button").style.top = xy[1] + 'px';    
}