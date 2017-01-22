var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var change = 1;
canvas.width = 512;
canvas.height = 480;


//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
	bgReady = true;
};
bgImage.src = 'background.png';

var heroReady = false;
var heroImage = new Image();
heroImage.src = 'hero.png'
heroImage.onload = () => heroReady = true;

var monsterReady = false;
var monsterImage = new Image();
monsterImage.src = 'monster.png'
monsterImage.onload = () => monsterReady = true;

// Game objects
var hero = {
	speed: 256, //Movement in pixels per second
	x: 0,
	y: 0

};

var monster = {
	speed: 256,
	x: 0,
	y: 0

};

var monsterCaught = 0;

var keysDown = {};

addEventListener('keydown', function(event) {
	keysDown[event.keyCode] = true;
}, false);

addEventListener('keyup', function(event) {
	delete keysDown[event.keyCode];
}, false);

// Reset the game when the player catches a monster
function reset() {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.width - 64));
}

function randomFloat() {
	return Math.floor(Math.random() * 2)
}
setInterval(() => {
	let number = randomFloat();
	if (number === 1) {
		change = -1;
	} else if (number === 0) {
		change = 1;
	}

}, 500)

//Update game objects
function update(modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}


	monster.x += monster.speed * modifier * change;
	monster.y += monster.speed * modifier * change;



	if(monster.x >= canvas.width - 32) {
		monster.x -= monster.speed * modifier;
	} else if( monster.x <= 32 ){
		monster.x += monster.speed * modifier;	
	} else  if(monster.y >= canvas.height - 32) {
		monster.y -= monster.speed * modifier;
	} else if (monster.y <= 32){
		monster.y += monster.speed * modifier;	
	}

	//Collision detection
	if (hero.x <= (monster.x + 32) &&
		monster.x <= (hero.x + 32) &&
		hero.y <= (monster.y + 32) &&
		monster.y <= (hero.y + 32)


	) {
		monsterCaught += 1;
		reset();
	}
}

//Draw Everything
function render() {
	if (bgReady) {
		context.drawImage(bgImage, 0, 0);
	}
	if (heroReady) {
		context.drawImage(heroImage, hero.x, hero.y);
	}
	if (monsterReady) {
		context.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	context.fillStyle = 'rgb(250, 250, 250)';
	context.font = '24px Helvetica';
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.fillText(`Monsters caught:${monsterCaught}`, 32, 32);
}

// The game loop
function gameLoop() {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now
		//Request to do this again ASAP
	requestAnimationFrame(gameLoop)
}

//Let's play this game!
var then = Date.now();

reset();
gameLoop();
