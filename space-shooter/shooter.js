var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d')
var playerBullets = [];
var enemies = []

const canvas_width = 480;
const canvas_height = 420;
canvas.width = canvas_width;
canvas.height = canvas_height;

document.body.appendChild(canvas);

var playerImage = new Image();
playerImage.src = 'ship.png'
	// player.addEventListener('load',loadImage,false)
//https://chrismalnu.files.wordpress.com/2016/02/clash.png?w=680
/*Player object with all the relevant attributes with a method with access to
these*/
var player = {
	color: '#00A',
	x: canvas_width,
	y: 170,
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
		console.log('shoot')
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
	enemies = enemies.filter(enemy => enemy.active)
	if (Math.random() < 0.1) {
		enemies.push(Enemy());
	}
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
	I.color = '#000000';

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

	I.color = '#A2B';
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
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	I.update = function() {
		I.x += I.xVelocity;
		I.y += I.yVelocity;

		I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

		I.age++;

		I.active = I.active && I.inBounds();
	};

	return I;
}


//
// player.draw = function() {
// 	this.sprite.draw(ctx, this.x, this.y);
// }















var FPS = 30;
setInterval(function() {
	update();
	draw();
}, 1000 / FPS)
