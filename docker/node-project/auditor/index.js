// Inspired by the example station.js in 05-UdpProgramming (Olivier Liechti)

// Configuration file
const protocol = require('./properties');


// UDP side
// We use a standard Node.js module to work with UDP
const dgram = require('dgram');

// Variables
var song = [];

// Let's create a datagram socket. We will use it to listen for datagrams published in the
// multicast group by thermometers and containing measures
const serverUDP = dgram.createSocket('udp4');
serverUDP.bind(protocol.PROTOCOL_PORT, function() {
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
song.push("" + msg);
var songStr = JSON.stringify(song);
console.log(songStr);
});

// TCP side
// Inspired by https://medium.com
// We use a standard Node.js module to work with TCP
var net = require('net');

// Create the server TCP
var serverTCP = net.createServer();
serverTCP.on('connection', handleConnection);

// Callback function
serverTCP.listen(2205, function() {
  const address = serverTCP.address();
  console.log(`server listening TCP on ${address.address}:${address.port}`);
});

function handleConnection(conn) {
  // Sending JSON array to Client
  var songStr = JSON.stringify(song);
  conn.write(songStr);

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
