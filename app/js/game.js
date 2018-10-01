var scrWidth = 1200;
var scrHeight = 800;
var BallCount = 20;
ParticlesCount = 1000;

class vector2D{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

class colorRGBA{
  constructor(R, G, B, A){
    this.R = R;
    this.G = G;
    this.B = B;
    this.A = A;
  }
}

class Ball{

  constructor(radius, posX, posY, velocity, vectorX, vectorY, R, G, B, A){
    this.radius   = radius;
    this.posX     = posX;
    this.posY     = posY;
    this.velocity = velocity;
    this.vector   = new vector2D(vectorX, vectorY);
    this.color    = new colorRGBA(R,G,B,A)
  }

  moveBall(){
    this.posX = this.posX + this.velocity * this.vector.x;
    this.posY = this.posY + this.velocity * this.vector.y;
  }

  particles(){

  }

  physBall(){
    if(this.velocity>0){
     //this.velocity = this.velocity - 0.01;
    }
    if((this.posX >= scrWidth - this.radius) || (this.posX <= this.radius)){
      this.vector.x = this.vector.x * (-1);
    }
    if((this.posY >= scrHeight - this.radius) || (this.posY <= this.radius)){
      this.vector.y = this.vector.y * (-1);
    }
  }

  getColor(){
    return "rgba(" + this.color.R + "," + this.color.G + "," + this.color.B + "," + this.color.A + ")";
  }
}



class Particle{
  constructor(x, y, velocity, vectorX, vectorY, life, R, G, B, A){
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.vector = new vector2D(vectorX, vectorY);
    this.color = new colorRGBA(R, G, B, A);
    this.fullLife = 256;
    this.life = life;
  }

  move(){
    this.x = this.x + this.velocity * (Math.random() - 0.5)*this.vector.x;
    this.y = this.y + this.velocity * (Math.random() - 0.5)*this.vector.y;
  }

  lifeCycle(){
    this.life -= 1;
    this.color.A = this.life / this.fullLife;
  }

  start(){
    this.move();
    this.lifeCycle();
  }

  getColor(){
    return "rgba(" + this.color.R + "," + this.color.G + "," + this.color.B + "," + this.color.A + ")";
  }

}

var Balls = [];
var Particles = [];

function init() {
  for(i=0; i<BallCount; i++){
    var vect = Math.random();
    c = Math.random()*128;
    Balls[i] = new Ball(Math.random()*10 +10, Math.random()*(scrWidth-10) + 10, Math.random()*(scrHeight - 10) + 10, Math.random()*3 + 5, vect, 1-vect, c, c, c, 0.4);
  }
  for(i=0; i<ParticlesCount; i++){
    var vect = new vector2D(Math.random()-0.5, Math.random()-0.5);
    vect = normalize(vect);
    var c = Math.random()*256;
    Particles[i] = new Particle(mouseX, mouseY, Math.random()*5 + 2, vect.x, vect.y, Math.random()*230 + 20, c, c, c, Math.random());
  }
  window.requestAnimationFrame(draw);
}



var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var mouseX, mouseY;


canvas.onmousemove = function(event){
  mouseX = event.offsetX;
  mouseY = event.offsetY;
}

function normalize(vector){
  var length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  vector.x = vector.x / length;
  vector.y = vector.y / length;
  return vector;
}

function draw() {
  

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, scrWidth, scrHeight); 
  
  for(i=0; i<ParticlesCount; i++){
    if(Particles[i] != null){
      Particles[i].start();
      ctx.fillStyle = Particles[i].getColor();
      ctx.beginPath();
      ctx.arc(Particles[i].x, Particles[i].y, 1, 0, 360, false);
      ctx.fill();
    } else
    {
      var vect = Math.random();
      var c = Math.random()*128;
      Particles[i] = new Particle(mouseX, mouseY, Math.random()*5 + 2, vect, 1-vect, Math.random()*230 + 20, c, c, c, Math.random()*128);
    }
    if(Particles[i].life <= 0){
      Particles[i] = null;
    }
  }

  for(i=0; i<BallCount; i++){
    var length = ((Math.sqrt(Math.pow(mouseX - Balls[i].posX, 2) + Math.pow(mouseY - Balls[i].posY, 2))));
    ctx.fillStyle = Balls[i].getColor();
    ctx.beginPath();
    ctx.arc(Balls[i].posX, Balls[i].posY, Balls[i].radius, 0, 360, false);
    ctx.fill();
    
    if(length<300){
      ctx.strokeStyle = "rgba(" + Balls[i].color.R + "," + Balls[i].color.G + "," + Balls[i].color.B + "," + 40/length + ")";
      ctx.beginPath();
      ctx.moveTo(Balls[i].posX, Balls[i].posY);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
      if(length>100){
        var mVector = new vector2D(Balls[i].posX - mouseX, Balls[i].posY - mouseY);
        mVector = normalize(mVector);
        Balls[i].vector.x = Balls[i].vector.x - mVector.x/((Math.sqrt(Math.pow(mouseX - Balls[i].posX, 2) + Math.pow(mouseY - Balls[i].posY, 2)))/10);
        Balls[i].vector.y = Balls[i].vector.y - mVector.y/((Math.sqrt(Math.pow(mouseX - Balls[i].posX, 2) + Math.pow(mouseY - Balls[i].posY, 2)))/10);
        //Balls[i].velocity = Balls[i].velocity + Math.abs(mVector.y/((Math.sqrt(Math.pow(mouseX - Balls[i].posX, 2) + Math.pow(mouseY - Balls[i].posY, 2)))/10));
        Balls[i].vector = normalize(Balls[i].vector);
      }
    }
    Balls[i].moveBall();
    Balls[i].physBall();
  }
  window.requestAnimationFrame(draw);
}

init();