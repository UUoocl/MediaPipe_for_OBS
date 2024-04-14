let capture;


function setup() {
  createCanvas(1280, 720);

  // Create the video capture and hide the element.
  console.log("Create Video Object")
  capture = createCapture(VIDEO);
  console.log("capture",capture)
  capture.hide();

  describe('A video stream from the webcam with inverted colors.');
}

function draw() {
  const randX = random(0, width);
    const randY = random(0, height);
  // Draw the video capture within the canvas.
  image(capture, 0, 0, width, width * capture.height / capture.width);
  //const imgPixelColor = capture.get(randX, randY);
  //console.log(imgPixelColor)
  // Invert the colors in the stream.
  filter(INVERT);

  
    if (mouseIsPressed) {
      fill(0);
    } else {
      fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
  
}