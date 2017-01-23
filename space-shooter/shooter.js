var start = document.querySelector('.start')
	// start.addEventListener('click', startGame)
var stopBtn = document.querySelector('.stop')
stopBtn.addEventListener('click',stop)

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
var playerBullets = [];
var enemies = []
var score = 0;
var winLimit = 15;
//This var is a modifier that changes game object velocity based on actual time
//passing
var delta = 0;


document.querySelector('.reset').onclick = function() {
	location.reload();
}

const canvas_width = 1000;
const canvas_height = 620;
canvas.width = canvas_width;
canvas.height = canvas_height;


var fire = new Audio('blaster.mp3');
var explosion = new Audio('Explosion.mp3');


var playerImage = new Image();
playerImage.src = 'ship.png'

var enemyImage = new Image();
enemyImage.src = 'enemies.png';
// player.addEventListener('load',loadImage,false)
//https://chrismalnu.files.wordpress.com/2016/02/clash.png?w=680
/*Player object with all the relevant attributes with a method with access to
these*/
var player = {
	x: canvas_width / 2,
	y: canvas_height / 2 + 200,
	width: 32,
	height: 32,
	active: true,
	draw: function() {
		if (this.active) {
			ctx.drawImage(playerImage, this.x, this.y)
		}
	}
}

var keyStatus = {
	left: false,
	right: false,
	down: false,
	up: false,
	spacebar: false
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
	} else if (event.keyCode === 32) {
		keyStatus.spacebar = true

	}

	// 	console.log(keyStatus)

});

document.addEventListener('keyup', function(event) {
	for (var status in keyStatus) {
		if (keyStatus.hasOwnProperty(status)) {
			keyStatus[status] = false
		}
	}
});

function Particle() {
	this.scale = 1;
	this.x = 0;
	this.y = 0;
	this.radius = 20;
	this.color = '#000'
	this.velocityX = 0;
	this.velocityY = 0;
	this.scaleSpeed = 0.5;

	this.update = function(ms, delta) {
		//Shrinking	
		this.scale -= this.scaleSpeed * ms / 1000.0

		if (this.scale <= 0) {
			this.scale = 0;
		}
		//Moving away from the explosion center
		this.x += this.velocityX * ms / 1000.0//  * delta;
		this.y += this.velocityY * ms / 1000.0// * delta;

		this.draw = function() {
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.scale(this.scale, this.scale)

			//Drawing a filled circle in the particle's local scope
			ctx.beginPath();
			ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();

			ctx.restore();
		}
	}
}

var particles = [];
/* Creates explosion, all particles move and shrink at the same speed */
function createExplosion(x, y, color) {
	var minSize = 10;
	var maxSize = 30;
	var count = 20;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;
	var minScaleSpeed = 1.0;
	var maxScaleSpeed = 4.0;
	//Creating 4 particles that scatter at 0,90,180,270 degrees, changed to
	//scatter in many more directions with 360/count	
	for (var angle = 0; angle < 360; angle += Math.round(360 / count)) {
		var particle = new Particle();
		//Particle will start at the explosion center
		particle.x = x;
		particle.y = y;

		particle.radius = randomFloat(minSize, maxSize)
		particle.color = color;

		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed)// * delta;
		var speed = randomFloat(minSpeed, maxSpeed);

		//velocity is rotated by 'angle'
		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0)// * delta;
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0)// * delta;

		//Add newly created particle to 'particles' array
		particles.push(particle);
	}
}

function randomFloat(min, max) {
	return min + Math.random() * (max - min);
}

function generateExplosion(delta) {
	for (var i = 0, len = particles.length; i < len; i++) {
		let particle = particles[i];
		particle.update(20, delta);
		particle.draw()
	}
}



function update(delta) {
	if (keyStatus.spacebar) {
		player.shoot();
	}
	if (keyStatus.right) {
		player.x += 0.8 * delta;
	}
	if (keyStatus.left) {
		player.x -= 0.8 * delta;
	}
	if (keyStatus.up) {
		player.y -= 0.8 * delta;
	}
	if (keyStatus.down) {
		player.y += 0.8 * delta;
	}
	if (player.x + player.width >= canvas.width) {
		player.x -= 0.8 * delta;
	}
	if (player.x <= 0) {
		player.x += 0.8 * delta;
	}
	playerBullets.forEach(function(bullet) {
		bullet.update(delta);
	})
	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});
	enemies.forEach((enemy) => {
			enemy.update(delta);
		})
		/*This random number generator controls the rate at which new enemy ships are
			drawn I've also added a limit of 5*/
	enemies = enemies.filter(enemy => enemy.active)
	if (Math.random() < 0.03 && enemies.length <= 5) {
		enemies.push(Enemy());
	}
	handleCollisions();
}


function draw() {
	ctx.clearRect(0, 0, canvas_width, canvas_height)
	player.draw();
	playerBullets.forEach(function(bullet) {
		bullet.draw();
	});
	enemies.forEach((enemy) => enemy.draw())
	generateExplosion();
	ctx.font = '30px VT323'
	ctx.fillText(`Score: ${score}`, 5, 30)
	if (score >= winLimit) {
		score = 0;
		ctx.font = '40px VT323'
		ctx.fillText('You Win!!', (canvas_width / 2) - 50, canvas_height / 2)
			//Resets the game if score is greater than a preset win limit
			// clearInterval(gameInterval);
			//If player is hit becomes inactive and game stops and message is printed
	} else if (!player.active) {
		ctx.font = '40px VT323';
		ctx.fillStyle = 'red'
		ctx.fillText('You Lose!!', (canvas_width / 2) - 100, canvas_height / 2);
		// clearInterval(gameInterval);

	}
}

function Bullet(I) {
	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.height = 3;
	I.width = 3;
	fire.currentTime = 0;
	I.color = '#FF0000';

	I.inBounds = function() {
		return I.x >= 0 && I.x <= canvas_width && I.y > 0 && I.y <= canvas_height;
	}
	I.draw = function() {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
	I.update = (delta) => {
		I.x += I.xVelocity * delta
		I.y += I.yVelocity * delta

		I.active = I.active && I.inBounds();
	}
	return I
}

player.shoot = function() {
	fire.currentTime = 0;
	fire.play();
	var bulletPosition = this.midpoint();

	playerBullets.push(Bullet({
		speed: 0.8,
		x: bulletPosition.x,
		y: bulletPosition.y,

	}));
};
player.midpoint = function() {
	return {
		//added 65 to position where bullets originate as they were off center
		x: this.x + (this.width + 65) / 2,
		y: this.y + this.height / 2
	};
};

function Enemy(I) {
	I = I || {};

	I.active = true;
	I.age = Math.floor(Math.random() * 128)

	// 	I.color = '#A2B';
	I.x = canvas_width / 4 + Math.random() * canvas_width / 2;
	I.y = 0;
	I.xVelocity = 0;
	I.yVelocity = 0.4;

	I.width = 32;
	I.height = 32;

	I.inBounds = function() {
		return I.x >= 0 && I.x <= canvas_width &&
			I.y >= 0 && I.y <= canvas_height;
	};

	I.draw = function() {
		ctx.drawImage(enemyImage, I.x, I.y)
			// ctx.fillStyle = this.color;
			// ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	I.update = function(delta) {
		I.x += I.xVelocity * delta;
		I.y += I.yVelocity * delta;

		I.xVelocity = 0.3 * Math.sin(I.age * Math.PI / 64);

		I.age++;
		I.explode = function() {
			if (this) {
				explosion.currentTime = 0;
				explosion.play();
				this.active = false;
				createExplosion(this.x, this.y, '#525252');
				createExplosion(this.x, this.y, '#FFA318');
				if (player.active) {
					score += 1
				}
			}
		}
		I.active = I.active && I.inBounds();
	};

	return I;
}


function collides(a, b) {
	return a.x < b.x + b.width &&
		a.x + a.width > b.x && a.y < b.y +
		b.height && a.y + a.height > b.y;
}

function handleCollisions() {
	playerBullets.forEach(function(bullet) {
		enemies.forEach(function(enemy) {
			if (collides(bullet, enemy)) {
				enemy.explode();
				bullet.active = false;
			}
		})
	});
	enemies.forEach((enemy) => {
		if (collides(enemy, player)) {
			enemy.explode();
			player.explode();
		}
	})
}

player.explode = function() {
	if (this.active) {
	this.createExplosion(this.x, this.y, '#525252');
	this.createExplosion(this.x, this.y, '#FFA318');
	this.active = false;
	}
	return;
}
var lastFrameTimeMs = 0, // The last time the loop was run
	maxFPS = 60; // The maximum FPS we want to allow
var timestep = 1000 / 60;

function runGame(timeStamp) {
	//Throttle the framerate
	if (timeStamp < lastFrameTimeMs + (1000 / maxFPS)) {
		frameID = requestAnimationFrame(runGame);
		return;
	}
	delta += timeStamp - lastFrameTimeMs;
	lastFrameTimeMs = timeStamp

	//Simulate the total elapsed time in fixed-size chunks
	while (delta >= timestep) {
		//Time step value is reduced further to slow movement of game objects
		update(timestep/3.5);
		delta -= timestep;
	}
	draw();
frameID = requestAnimationFrame(runGame);
}
var frameID = requestAnimationFrame(runGame)

var running = false,
	started = false;

function stop(){
	running = false;
	started = false;
	cancelAnimationFrame(frameID);
}

