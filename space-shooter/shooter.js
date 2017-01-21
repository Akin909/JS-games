var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
var playerBullets = [];
var enemies = []

const canvas_width = 480;
const canvas_height = 620;
canvas.width = canvas_width;
canvas.height = canvas_height;

document.body.appendChild(canvas);

var fire = new Audio('blaster.mp3');


var playerImage = new Image();
playerImage.src = 'ship.png'

var enemyImage = new Image();
enemyImage.src = 'enemies.png';
// player.addEventListener('load',loadImage,false)
//https://chrismalnu.files.wordpress.com/2016/02/clash.png?w=680
/*Player object with all the relevant attributes with a method with access to
these*/
var player = {
	color: '#00A',
	x: canvas_width / 2,
	y: canvas_height / 2 + 200,
	width: 32,
	height: 32,
	draw: function() {
		ctx.drawImage(playerImage, this.x, this.y)
			// ctx.fillStyle = this.color
			// ctx.fillRect(this.x, this.y, this.width, this.height)
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



function update() {
	if (keyStatus.spacebar) {
		player.shoot();
	}
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
		player.x -= 5;
	}
	if (player.x <= 0) {
		player.x += 5;
	}
	playerBullets.forEach(function(bullet) {
		bullet.update();
	})
	playerBullets = playerBullets.filter(function(bullet) {
		return bullet.active;
	});
	enemies.forEach((enemy) => {
			enemy.update();
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
}

function Bullet(I) {
	I.active = true;
	I.xVelocity = 0;
	I.yVelocity = -I.speed;
	I.height = 3;
	I.width = 3;
	I.color = '#FF0000';

	I.inBounds = function() {
		return I.x >= 0 && I.x <= canvas_width && I.y > 0 && I.y <= canvas_height;
	}
	I.draw = function() {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}
	I.update = () => {
		I.x += I.xVelocity
		I.y += I.yVelocity

		I.active = I.active && I.inBounds();
	}
	return I
}

player.shoot = function() {
	fire.currentTime = 0;
	fire.play();
	var bulletPosition = this.midpoint();

	playerBullets.push(Bullet({
		speed: 5,
		x: bulletPosition.x,
		y: bulletPosition.y,

	}));
};
player.midpoint = function() {
	return {
		x: this.x + this.width / 2,
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
	I.yVelocity = 2;

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

	I.update = function() {
		I.x += I.xVelocity;
		I.y += I.yVelocity;

		I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

		I.age++;
		I.explode = function() {
		this.active = false;	
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
			if (collides(enemy, bullet)) {
				enemy.explode();
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
	this.active = false;
}












var FPS = 30;
setInterval(function() {
	update();
	draw();
}, 1000 / FPS)
