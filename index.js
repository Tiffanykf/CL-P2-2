//Initialize the express 'app' object
let express = require("express");
let app = express();

//Initialize HTTP server
let http = require("http");
let server = http.createServer(app);

//Initialize socket.io
let io = require("socket.io");
io = new io.Server(server);

app.use("/", express.static("public"));

//'port' variable allows for deployment
let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("App listening at port: " + port);
});

//Global variables
let mazers = {};


//Calculate distance between mouse positions
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function getMidpoint(x1, y1, x2, y2) {
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;
  return { x: midX, y: midY };
}

//Listen for a client to connect and disconnect
io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);
  
  //Listen for messages from the client
  // Store the user's initial position
  mazers[socket.id] = { x: 0, y: 0 };

  // Listen for mouse position updates from the client
  socket.on('message', (mouseData) => {
    mazers[socket.id] = mouseData;
  
            // Check for close mouse positions with other users
            for (let [id, pos] of Object.entries(mazers)) {
              if (id !== socket.id) {
                  let distance = getDistance(mouseData.x, mouseData.y, pos.x, pos.y);
                  if (distance <= 30) {
                      io.emit('positiveEvent', { user1: socket.id, user2: id });
                      console.log(`Positive event between ${socket.id} and ${id}`);
                      let midpoint = getMidpoint(mouseData.x, mouseData.y, pos.x, pos.y);
                      io.emit('midpoint', midpoint)
                      console.log(midpoint); 
                  }
              }
          }

//Send data to ALL clients, including this one
// io.emit('message-share', data);

//Send data to ALL other clients but the sender
// socket.broadcast.emit('message-share', data);

//Send the data just to the sender
// socket.emit('message-share', data);
});

  //Listen for this client to disconnect
  socket.on("disconnect", () => {
    console.log("A client has disconnected: " + socket.id);
  });
});