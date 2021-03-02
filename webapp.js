var lost = false;

function win() {   
    document.getElementById('ausgabe').textContent = "You win!";
}

function lose() {
    document.getElementById('ausgabe').textContent = "You lose!";
    lost = true;
}

function getRandomPosition(element) {
	var y = window.innerHeight-element.clientHeight;
	var x = window.innerWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x);
	var randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}

function changePosition() {
    var xy = getRandomPosition(document.getElementById('buttonGame')); 
    document.getElementById('buttonGame').style.left = xy[0] + 'px';
    document.getElementById('buttonGame').style.top = xy[1] + 'px';    
}

function getName() {
    document.getElementById("ausgabe").textContent = window.location.pathname.split('/').pop;
}

(function() {
     if (!lost && window.location.pathname.split('/').pop() == 'dontPress.html') {        
        document.onmousemove = handleMouseMove;
        function handleMouseMove(event) {
            var eventDoc, doc, body;

            event = event || window.event; 
            if (event.pageX == null && event.clientX != null) {
                eventDoc = (event.target && event.target.ownerDocument) || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = event.clientX +
                  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                  (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY +
                  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
                  (doc && doc.clientTop  || body && body.clientTop  || 0 );
            }

            document.getElementById('buttonGame').style.left = (event.pageX - (document.getElementById('buttonGame').clientWidth / 2)) + 'px';
            document.getElementById('buttonGame').style.top = (event.pageY - (document.getElementById('buttonGame').clientHeight / 2)) + 'px'; 
        }    
     }
})();