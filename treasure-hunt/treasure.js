const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 1000;
const canvas_width = canvas.width;
const canvas_height = canvas.height;


var greenZone, blueZone;
var x = 10;
var y = 10;
var width = 100;
var height = 30;
var speed = 5;
var speedY = 0;



function update() {
var crossedRightLimit = x >= canvas_width;
var crossedLeftLimit = x <= 0;


if (crossedLeftLimit) {
		x = 0;	
		speed = -speed;
	
} else if (crossedRightLimit) {
		x = canvas_width;	
		speed = -speed;
	} 
	if (x > 100 && x < 150) {
		speedY = 1;
	y += speedY;
	} else {
		y = y;
	speedY = 0;	

	}
	x += speed;
	//Define color
	blueZone = x > 0 && x < canvas_width/2;
	greenZone = !blueZone && x < canvas_width; 
}

function draw() {
	context.clearRect(0, 0, canvas_width, canvas_height)
		if (blueZone){
	context.fillStyle = '#3333FF'	
	} else if (greenZone){
	context.fillStyle = '#00CC66'	
	}
	context.fillRect(x, y, width, height);

}

function step() {

	update();
	draw();


	window.requestAnimationFrame(step);
}

	step();
