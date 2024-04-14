// const sketchHeight = windowWidth;
// const sketchWidth = windowHeight;

let audio;
let audio2;
let mic;
let button;
let button2;

let fft;
let amp;

let micLevels = [];
let micLevels2 = [];

let strahlen = 16;
let rects = 1;

let i = 0;
let c = 0;
let constructColor = [80, 100, 100, 200, 200, 80];
let constructColor2 = [200, 250, 0, 0, 255, 255];
let constructColor3 = [255, 255, 255];

//AUDIO FILE LADEN
function preload() {
  // audio = loadSound('ventura.wav');
  // audio2 = loadSound('vivaldi.mp3');
}

//PLAY BUTTON
function togglePlaying() {
  audio.play();

  //  if (!audio.isPlaying()){
  //    audio.play();
  //    audio.setVolume(0.6);
  //    button2.html("pause Sound")
  //  } else {
  //    audio.pause();
  //    button2.html("play Sound");
  //  }
}

function resetColor() {
  c = 0;
  constructColor = [80, 100, 100, 200, 200, 80];
  constructColor2 = [200, 250, 0, 0, 255, 255];
  constructColor3 = [255, 255, 255];
}

function randomColor() {
  c = 3;
  constructColor = [80, 100, 100, random(0,360), random(0,100), random(0,100)];
  constructColor2 = [200, 250, 0, random(0,255), random(0,255), random(0,255)];
  constructColor3 = [random(0,255), random(0,255), random(0,255)];
}

function lightColor() {
  c = 0;
  constructColor = [280, 10, 100];
  constructColor2 = [250, 180, 100];
  constructColor3 = [20, 255, 255];
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(20);
  button = createButton("– r e s e t –");
  button.mousePressed(resetColor);
  button = createButton("– r a n d o m –");
  button.mousePressed(randomColor);
  button = createButton("– l i g h t –");
  button.mousePressed(lightColor);
  // button2 = createButton("play Ventura");
  // button2.mousePressed(togglePlaying);

  // audio activation...
  // fft = new p5.FFT(0.8, 64); //smooth Value by avaraging previous with actual Data
  // amp = new p5.Amplitude();

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(20, 20);
  translate(windowWidth / 2, windowHeight / 2);
  strokeWeight(1);
  noFill();
  scale(1.5);

  //RADIAL SPECTRUM LINES
  push();
  let pushLevel = mic.getLevel();
  micLevels.push(pushLevel);

  for (let i = 0; i < strahlen; i++) {
    let angle = map(i, 0, strahlen, 0, 360);
    let level = micLevels[i];

    let r = map(level, 0, 0.2, 10, 300);

    let x = r * cos(angle);
    let y = r * sin(angle);
    let x2 = 20 * cos(angle);
    let y2 = 20 * sin(angle);

    rotate(45);
    colorMode(RGB);
    stroke(
      constructColor3[0], 
      constructColor3[1], 
      constructColor3[2], 
      [0.4]);
    strokeWeight(0.5);
    line(x / 1.5, y / 1.5, x, y);

    colorMode(HSB);
    stroke(
      i * 6 + constructColor[c],
      constructColor[c + 1],
      constructColor[c + 2],
      [0.4]
    );
    line(x2 * 3, y2 * 6, x, y);

    line(x2 * 6, y2 * 3, x, y);
  }

  if (micLevels.length > strahlen) {
    micLevels.splice(0, 1);
  }
  pop();

  push();
  pushLevel = mic.getLevel();
  micLevels2.push(pushLevel);

  for (let j = 0; j < rects; j++) {
    let level = micLevels2[j];
    let r = map(level, 0, 0.2, 80, 260);

    stroke(
      i * 4 + constructColor2[c],
      constructColor2[c + 1],
      constructColor2[c + 2],
      [0.4]
    );
    strokeWeight(0.5);
    rect(-r / 2, -r / 2, r, r);
  }

  if (micLevels.length > rects) {
    micLevels2.splice(0, 1);
  }
  pop();

  //console.log(micLevels2.length);
}

// © Lucas Textor
