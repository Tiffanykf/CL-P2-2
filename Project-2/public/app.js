//Initialize and connect socket
let socket = io();

//global variables
let myRed, myGreen, myBlue;
let myDiameter;

let circles = [];

function setup(){
    createCanvas(windowWidth, windowHeight);

        //Generate random fill values
        myRed = random(150,255);
        myGreen = random(100,230)
        myBlue = random(170,255);
    
        //Generate random ellipse size
        myDiameter = 10;

        mazePath();
}

function draw(){
  background(220);
  drawCircles();

      // Listen for positive events
      socket.on('positiveEvent', ({ user1, user2 }) => {
        console.log(`Positive event detected between users ${user1} and ${user2}`);
      });

        //Listen for midpoint data
        socket.on('midpoint', function(midpoint) {
          console.log(midpoint);
          drawPos(midpoint);
        });
}

function mouseMoved() {
  //Grab mouse position

let mouseData = {
    x: mouseX,
    y: mouseY
  }

  //Send mouse data object to the server
  socket.emit('message', mouseData);
}

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
  });

//Expects an object with a and y properties
function drawPos(pos) {
  fill(255, 255, 0);
  noStroke();
  circle(pos.x, pos.y, 10);
}

// function drawEllipse(obj) {
//   fill(255,255,0);
//   // noStroke();
//   ellipse(obj.x, obj.y, obj.d, obj.d);
// }

function mazePath() {
  let protection = 0;

  while (circles.length < 300 && protection < 10000) {
    // Combined limit check
    let circle = {
      x: random(windowWidth),
      y: random(windowHeight),
      rad: random(10, 25),

      r: random(150, 255),
      g: random(100, 230),
      b: random(170, 255),
    };

    let overlapping = false;

    for (let j = 0; j < circles.length; j++) {
      let other = circles[j];
      let d = dist(circle.x, circle.y, other.x, other.y);
      if (d < circle.rad + other.rad) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      circles.push(circle);
    }
    
    protection++;
  }
}

function drawCircles() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i]; // Access each circle in the array
    fill(circle.r, circle.g, circle.b); // Use each circle's color
    ellipse(circle.x, circle.y, circle.rad * 2, circle.rad * 2);
  }
}


// //Listen for an event named 'message-share' from the server
// socket.on('message-share', (data) => {
//     console.log(data);
  
//   });