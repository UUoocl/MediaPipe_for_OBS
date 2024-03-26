let cols; let rows; let size = 4;
let grid; 

let play = true;
let hueValue = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 255);
  
  cols = width/size;
  rows = height/size;
  
  grid = new Grid();
  
//   let playBtn = createButton('Play'); 
//   playBtn.position(0, height + 20); 
//   playBtn.mousePressed(playGrid);
  
//   let resetBtn = createButton('Reset'); 
//   resetBtn.position(45, height + 20); 
//   resetBtn.mousePressed(resetGrid);
  
//   let randomBtn = createButton('Random'); 
//   randomBtn.position(100, height + 20); 
//   randomBtn.mousePressed(randomGrid);
  
}

function draw() {
  clear()
  background(55,55,55,0);
  if (play) {
    grid.update();
  }
  grid.display();
  
}

function playGrid() {
  play = !play;
}

function resetGrid() {
  grid.resetGrid();
}

function randomGrid() {
  grid.randomGrid();
}

window.addEventListener("pose-landmarks", function (event) {
    //console.log("message received: ",event)
    pose = event.detail.poseLandmarkerResult
  let margin = 2;
  let x = floor(pose[15].x * width / size);
  let y = floor(pose[15].y * height / size);
  
  for (let i=-margin; i<margin; i++) {
    for (let j=-margin; j<margin; j++) {
      let xi = x + i;
      let yi = y + j;
      xi = constrain(xi, 0, cols-1);
      yi = constrain(yi, 0, rows-1);
      grid.grid[xi][yi] = 1; 
    }
  }
  
  let x2 = floor(pose[16].x * width / size);
  let y2 = floor(pose[16].y * height / size);
  
  for (let i=-margin; i<margin; i++) {
    for (let j=-margin; j<margin; j++) {
      let xi2 = x2 + i;
      let yi2 = y2 + j;
      xi2 = constrain(xi2, 0, cols-1);
      yi2 = constrain(yi2, 0, rows-1);
      grid.grid[xi2][yi2] = 1; 
    }
  }


  hueValue += 1;
  if (hueValue > 255) {
    hueValue = 1;
  }
});