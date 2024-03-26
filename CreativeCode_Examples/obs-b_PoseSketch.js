
// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let pose;
let i =0;
window.addEventListener("pose-landmarks", function (event) {
    //console.log("message received: ",event)
    pose = event.detail.poseLandmarkerResult
  });

function setup() {
  createCanvas(640, 480);
}

function draw() {
  if (pose) {
    console.log("drawing: ",pose)
    clear()
    let d = dist(pose[5].x * width, pose[5].y * height, pose[2].x * width, pose[2].y * height);
    fill(255, 0, 0);
    ellipse(pose[0].x * width, pose[0].y * height, d);
    fill(0, 0, 255);
    ellipse(pose[16].x * width, pose[16].y * height, 32 );
    ellipse(pose[15].x * width, pose[15].y * height, 32 );
    
    for (let i = 0; i < 33; i++) {
       let x = pose[i].x * width;
       let y = pose[i].y * height;
       fill(0,255,0);
       ellipse(x,y,16,16);
    }
  }
}
