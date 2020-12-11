/* global loadImage createCanvas noStroke background 
  fill circle mouseSpan mouseX mouseY constrain width height
  collideCircleCircle noLoop createSprite loadSound random
 rect frameCount

 */

let backgroundImage;
let health = 100
let timer = 200;

const healthSpan = document.querySelector("#health");

function preload() {
  backgroundImage = loadImage(
    "https://cdn.glitch.com/501ab798-ebe0-4f8e-b6b6-45b6f6472e12%2Fspace.jpg?v=1607669491788"
  );
}

function setup() {
  game.initialize();
}

function draw() {
  game.update();
}

function mouseMoved() {
  game.mouseMoved();
}

class Field {
  constructor(width, height, color) {
    Object.assign(this, { width, height, color });
  }
  clear() {
    background(backgroundImage);
  }
  clamp(x, y) {
    return { x: constrain(x, 0, this.width), y: constrain(y, 0, this.height) };
  }
}

class Agent {
  constructor(x, y, speed, target, diameter) {
    Object.assign(this, { x, y, speed, target, diameter });
  }
  move(field) {
    const [dx, dy] = [this.target.x - this.x, this.target.y - this.y];
    const distance = Math.hypot(dx, dy);
    if (distance > 1) {
      const step = this.speed / distance;
      Object.assign(this, field.clamp(this.x + step * dx, this.y + step * dy));
    }
  }
  collidesWith(other) {
    return collideCircleCircle(
      this.x,
      this.y,
      this.diameter,
      other.x,
      other.y,
      other.diameter
    );
  }
}

class Player extends Agent {
  constructor(x, y, speed, target) {
    super(x, y, speed, target, 10);
  }
  draw() {
    fill("white");
    circle(this.x, this.y, this.diameter);
  }
}

class Enemy extends Agent {
  constructor(x, y, speed, target) {
    super(x, y, speed, target, 20);
  }
  draw() {
    fill("rgba(255, 50, 50, 0.5)");
    circle(this.x, this.y, this.diameter);
  }
}

class Powerup {
  constructor(x, y, diameter) {
    this.x = random(0.1 * width, 0.9 * width);
    this.y = random(0.1 * height, 0.9 * height);
    this.diameter = 20;
    this.available = true;
    this.nextChangeFrame = random(timer, timer * 2);
  }
  draw() {
    if (this.available) {
      fill("green");
      this.diameter = 20;
    } else {
      fill("linen");
      this.diameter = 0;
    }
    circle(this.x, this.y, this.diameter);
  }
  timer() {
    if (frameCount > this.nextChangeFrame) {
      this.available = true;
    }
  }
}

const game = {
  initialize() {
    createCanvas(800, 800);
    this.field = new Field(width, height, "lightgreen");
    this.mouse = { x: 0, y: 0 };
    this.player = new Player(20, 20, 2.5, this.mouse);
    this.powerup = new Powerup(
      random(0.1 * width, 0.9 * width),
      random(0.1 * height, 0.9 * height),
      20
    );
    this.enemies = [
      new Enemy(4, 5, 2, this.player),
      new Enemy(94, 95, 1.5, this.player),
      new Enemy(400, 503, 1.8, this.player)
    ];
  },
  mouseMoved() {
    Object.assign(this.mouse, { x: mouseX, y: mouseY });
  },
  checkForCollisions() {
    for (let enemy of this.enemies) {
      if (enemy.collidesWith(this.player)) {
        health -= 1;
      }
    }
  },
  checkForPowerup() {
    if (this.player.collidesWith(this.powerup)) {
      health = constrain(health += 10, 0, 100);
      this.powerup.available = false;
      this.powerup.nextChangeFrame = frameCount + timer;
    }
  },
  update() {
    this.field.clear();
    for (let agent of [this.player, ...this.enemies]) {
      agent.move(this.field);
      agent.draw();
    }
    for (let powerup of [this.powerup]) {
      powerup.draw();
      powerup.timer();
    }
    this.checkForPowerup();
    this.checkForCollisions();
    healthSpan.textContent = health;
    if (health < 0) {
      window.alert("GAME OVER");
      noLoop();
    }
  }
};
