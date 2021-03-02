function openMenu() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

function win() {   
    document.getElementById('ausgabe').textContent = "You win!";
    document.getElementById('ausgabe').style.color = "green";  
}

function lose() { 
    document.getElementById('ausgabe').textContent = "You lose!";   
    document.getElementById('ausgabe').style.color = "red";  
    document.getElementById('buttonGame2').style.display = "none";
}

function getRandomPosition(element) {
	var y = window.innerHeight-element.clientHeight;
	var x = window.innerWidth-element.clientWidth;
	var randomX = Math.floor(Math.random()*x);
	var randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}

function changePosition() {
    var xy = getRandomPosition(document.getElementById('buttonGame1')); 
    document.getElementById('buttonGame1').style.left = xy[0] + 'px';
    document.getElementById('buttonGame1').style.top = xy[1] + 'px';    
}

function getName() {
    document.getElementById("ausgabe").textContent = window.location.pathname.split('/').pop;
}

function handleOrientation(event) {   
   
  var b = event.beta;
  var c = event.gamma;
  
  var txt2 = "b= " + String(b);
   var txt3 = "c= " + String(c);
   document.getElementById('ausgabe2').textContent = txt2;
   document.getElementById('ausgabe3').textContent = txt3;
 /*
  b = b + 180;
  c = c + 90:

  b = (b / 360) * window.innerHeight;
  c = (c / 180) * window.innerWidth;
  document.getElementById('ausgabe2').textContent = "b= ";
  document.getElementById('ausgabe3').textContent = "c= ";
  document.getElementById('buttonGame1').style.top = b + 'px';
  document.getElementById('buttonGame1').style.left = c + 'px';  */             
}  
                
(function() {    
     if (window.location.pathname.split('/').pop() == 'dontPress.html') {        
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

            document.getElementById('buttonGame2').style.left = (event.pageX - (document.getElementById('buttonGame2').clientWidth / 2)) + 'px';
            document.getElementById('buttonGame2').style.top = (event.pageY - (document.getElementById('buttonGame2').clientHeight / 2)) + 'px'; 
        }    
     }
})();