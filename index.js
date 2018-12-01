let backgroundImage;

function setup()  {
  backgroundImage = loadImage("grass.png");
  const canvas = createCanvas(400, 400);
  canvas.parent('sketch');
  noStroke();
}

function draw() {
  background(backgroundImage);
  fill("black");
  ellipse(mouseX, mouseY, 20);
}
