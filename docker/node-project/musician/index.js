// Inspired by the example thermometer.js in 05-UdpProgramming (Olivier Liechti)

// Configuration file
const protocol = require('./properties');

// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

// Let's create a datagram socket. We will use it to send our UDP datagrams
const socket = dgram.createSocket('udp4');

// Functions
function getNoise(instrument) {
  switch(instrument) {
    case "piano":
      return "ti-ta-ti";
    case "trumpet":
      return "pouet";
    case "flute":
      return "trulu";
    case "violin":
      return " gzi-gzi";
    case "drum":
      return "boum-boum";
    default:
  }
}

// Create a measure object and serialize it to JSON
const note = new Object();
note.instrument = process.argv[2];
note.noise = getNoise(note.instrument);
const payload = JSON.stringify(note);

// Send the payload via UDP (multicast)
const message = new Buffer(payload);
socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
function() {
  console.log("Sending payload: " + payload + " via port " + socket.address().port);
});
