var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

function draw(){
  ctx.clearRect(0,0, canvas.width,canvas.height)
  drawBall();
  x += dx;
  y += dy
  if( y + dy >canvas.height-ballRadius|| y + dy < ballRadius){
    dy = -dy;
    color = "blue"
  }
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){
  dx = -dx
  color = "green"
  }

}

function drawBall (){
    ctx.beginPath();
    ctx.arc(x,y,ballRadius,0,Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill()
    ctx.closePath();
}
setInterval(draw,10)

var x = canvas.width/2-100
var y = canvas.height-150;

var dx = 1;
var dy = -1;
var color = "yellow"
var ballRadius = 10;
