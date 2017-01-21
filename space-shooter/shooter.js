var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
var playerBullets = [];

const canvas_width = 480;
const canvas_height = 420;
canvas.width = canvas_width;
canvas.height = canvas_height;

document.body.appendChild(canvas);

var textX = 50;
var textY = 50;

function update() {
	if (keyStatus.right) {
		player.x += 5;
	}
	if (keyStatus.left) {
		player.x -= 5;
	}
	if (keyStatus.up) {
		player.y -= 5;
	}
	if (keyStatus.down) {
		player.y += 5;
	}
	if (player.x + player.width >= canvas.width) {
		console.log('stop the player')
		player.x -= 5;
	}
	if (player.x <= 0) {
		player.x += 5;
	}
	playerBullets.forEach(function (bullet) {
		bullet.update();	
	})
	playerBullets = playerBullets.filter(function (bullet) {
		return bullet.active;	
	});
}


function draw() {
	ctx.clearRect(0, 0, canvas_width, canvas_height)
	player.draw();
	playerBullets.forEach(function(bullet) {
		console.log('outside the shooting function')
		bullet.draw();	
	});
}
//Player object with all the relevant attributes with a method with access to
//these
var player = {
	color: '#00A',
	x: 220,
	y: 270,
	width: 32,
	height: 32,
	draw: function() {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
}

var keyStatus = {
	left: false,
	right: false,
	down: false,
	up: false
}
document.addEventListener('keydown', (event) => {
	if (event.keyCode === 37) {
		keyStatus.left = true
	} else if (event.keyCode === 39) {
		keyStatus.right = true
	} else if (event.keyCode === 38) {
		keyStatus.up = true
	} else if (event.keyCode === 40) {
		keyStatus.down = true
	}
// 	console.log(keyStatus)
});

document.addEventListener('keyup', function(event) {
	for (var status in keyStatus) {
		if (keyStatus.hasOwnProperty(status)) {
			keyStatus[status] = false
		}
	}
	// console.log(keyStatus)
});
function Bullet(I) {
	I.active = true;
		I.xVelocity = 0;
		I.yVelocity = -I.speed;
		I.height = 3;
		I.width = 3;
		I.color = '#000000';

	I.inBounds = function () {
		return I.x >= 0	&& I.x<= canvas_width && I.y > 0 && I.y <= canvas_height;
	}
	I.draw = function () {
		ctx.fillStyle = this.color	
		ctx.fillRect(this.x, this.y, this.width, this.height)
		console.log('shooting')
	}
	I.update = () =>{
		I.x += I.xVelocity	
		I.y += I.yVelocity

		I.active = I.active && I.inBounds();
	} 
	return I
}

player.shoot = function () {
	var bulletPosition = this.midpoint();	

	playerBullets.push(Bullet({
		speed:5,
		x: bulletPosition.x,
		y: bulletPosition.y,
	
	}));
	player.midpoint = function () {
		return {
		x:this.x + this.width/2,
			y:this.y + this.height/2
		};
	}
};

var FPS = 30;
setInterval(function() {
	update();
	draw();
}, 1000 / FPS)
