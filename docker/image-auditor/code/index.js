// Inspired by the example station.js in 05-UdpProgramming (Olivier Liechti)

// Configuration file
const protocol = require('./properties');

// We use moment.js module to make the timestamp
const moment = require('moment');

// UDP side
// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

// JSON Array for TCP Client
const activesMusicians = []

// Instrument's dictionary
const instruments = new Map();
instruments.set("ti-ta-ti", "piano");
instruments.set( "pouet", "trumpet");
instruments.set("trulu", "flute");
instruments.set("gzi-gzi", "violin");
instruments.set("boum-boum", "drum");

// Functions
function musiciansHandler(msg) {
  musician = JSON.parse(msg);

  var found = activesMusicians.find(function (elem) {
    return elem.uuid === musician.uuid;
  });

  if(typeof found === 'undefined') {
    newMusician = new Object();
    newMusician.uuid = musician.uuid;
    newMusician.instrument = instruments.get(musician.sound);
    newMusician.activeSince = moment().format();
    activesMusicians.push(newMusician);
    delete newMusician;
  } else {
    activesMusicians.forEach(function (elem) {
      if (elem.uuid === musician.uuid) {
        elem.activeSince = moment().format();
      }
    });
  }
  console.log(activesMusicians);
}

// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
const serverUDP = dgram.createSocket('udp4');
serverUDP.bind(protocol.PROTOCOL_PORT_UDP, function() {
console.log("Joining multicast group");
serverUDP.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// This call back is invoked when a new datagram has arrived.
serverUDP.on('listening', function() {
  const address = serverUDP.address();
  console.log(`server listening UDP on ${address.address}:${address.port}`);
});

serverUDP.on('message', function(msg, source) {
//console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Source port: " + source.port);
console.log(JSON.parse(msg.toString()).sound);
musiciansHandler(msg.toString());
});

// TCP side
// Inspired by https://medium.com
// We use a standard Node.js module to work with TCP
var net = require('net');

// Create the server TCP
var serverTCP = net.createServer();
serverTCP.on('connection', handleConnection);

// Callback function
serverTCP.listen(protocol.PROTOCOL_PORT_TCP, function() {
  const address = serverTCP.address();
  console.log(`server listening TCP on ${address.address}:${address.port}`);
});

function handleConnection(conn) {
  // Sending JSON array to Client
  var activesMusiciansStr = JSON.stringify(activesMusicians);
  conn.write(activesMusiciansStr);

  // Display connection informations
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);
  conn.setEncoding('utf8');
  conn.once('close', onConnClose);
  conn.on('error', onConnError);

  function onConnClose() {
    console.log('connection from %s closed', remoteAddress);
  }

  function onConnError(err) {
    console.log('Connection %s error: %s', remoteAddress, err.message);
  }
}

// Check Musician's lives
var intervalID = setInterval(function () {

}, 1000);
