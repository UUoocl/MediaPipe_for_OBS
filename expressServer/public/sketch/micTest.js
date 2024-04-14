// Coding Train / Daniel Shiffman
// http://thecodingtrain.com

// Code for: https://youtu.be/q2IDNkUws-A

let mic;

function setup() {
  createCanvas(200, 200);
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(0);
  let vol = mic.getLevel();
  ellipse(100, 100, 200, vol * 200);
}