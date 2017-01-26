const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 1000;
const canvas_width = canvas.width;
const canvas_height = canvas.height;


var x = 10;
var y = 10;
var width = 20;
var height = 30;

var speed = 2;


function update() {
	x += speed;
}

function draw() {
	context.clearRect(0, 0, canvas_width, canvas_height)
	context.fillStyle = 'green';
	context.rotate(20 * Math.PI / 180);
	context.fillRect(40, 40, 100, 30);

}

function step() {

	update();
	draw();


	window.requestAnimationFrame(step);
}

	step();
