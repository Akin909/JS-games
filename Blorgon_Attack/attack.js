const canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let x = 0;
let y = 0;

// onst spaceShip = new Image();
// spaceShip.onload = blastOff();
// spaceShip.src = 'spaceship.png'
// function blastOff(){
// console.log(spaceShip,"hello")
//  context.drawImage(spaceShip,400,400,1000,1000)
//  drawShip();
// }

function draw(){
  context.clearRect(0,0,canvas.width,canvas.height);
  drawShip();
  console.log('drawing')
}

function drawShip(){
  context.beginPath();
  context.moveTo(125+x,70+y);
  context.lineTo(100+x,75+y);
  context.lineTo(100+x,25+y);
  context.fill();
}

function move(event){
  if(event.keyCode === 39){
    x-=5
  }
  if(event.keyCode === 37){
    x+=5;
  }
  if(event.keyCode === 40){
    y+=5;
  }
  if(event.keyCode === 39){
    y-=5;
  }
}

canvas.addEventListener('keydown',move)

setInterval(draw,10);
