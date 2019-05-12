// Inspired by the example thermometer.js in 05-UdpProgramming (Olivier Liechti)

// Configuration file
const protocol = require('./properties');

// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

// https://www.npmjs.com/package/uuid
const uuidv4 = require('uuid/v4');

// Let's create a datagram socket. We will use it to send our UDP datagrams
const socket = dgram.createSocket('udp4');

// Instrument's dictionary
const instruments = new Map();
instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");

// Send the payload via UDP (multicast)
const musician = new Object();
musician.uuid = uuidv4();
musician.sound = instruments.get(process.argv[2]);
const payload = JSON.stringify(musician);
const message = new Buffer(payload);
var intervalID = setInterval(function () {
  socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS,
  function() {
    console.log("Sending payload: " + payload + " via port " + socket.address().port);
  })
}, 1000);
