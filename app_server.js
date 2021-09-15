const request = require('request');
const express = require("express");
const socket = require("socket.io");
//const { spawn } = require('child_process');

//const child_process = spawn('python',['python_socket.py']);

//child_process.stdout.on('data',(data)=>{
//  console.log(data.toString());
//})

// App setup
const PORT = process.env.PORT || 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

const io = socket(server);

io.on("connection", function (socket) {
  console.log("Made socket connection");
});

var goldcomex,silvercomex,inrspot,goldmcx,silvermcx;
function requestdata() {
    request('https://api.datakick.in/REST/harshJSONComex?API_Key=4abeca6d655f35eb5f32d8852efaf70d', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
//      console.log(res.body);
        var response = res.body;
        if(response){
          if(goldcomex){
            if(goldcomex>response['rows']['2']['Ask']){
              goldcomex = response['rows']['2']['Ask']
              io.sockets.emit('XAUUSDI',goldcomex);
            }else{
              goldcomex = response['rows']['2']['Ask']
              io.sockets.emit('XAUUSDD',goldcomex);
            }
          }else{
            goldcomex = response['rows']['2']['Ask'];
            io.sockets.emit('XAUUSD',goldcomex);
          }
          if(silvercomex){
            if(silvercomex>response['rows']['3']['Ask']){
              silvercomex = response['rows']['3']['Ask']
              io.sockets.emit('XAGUSDI',silvercomex);
            }else{
              silvercomex = response['rows']['3']['Ask']
              io.sockets.emit('XAGUSDD',silvercomex);
            }
          }else{
              silvercomex = response['rows']['3']['Ask'];
              io.sockets.emit('XAGUSD',silvercomex);
          }
          if(inrspot){
            if(inrspot>response['rows']['4']['Ask']){
              inrspot = response['rows']['4']['Ask']
              io.sockets.emit('INRSPOTI',inrspot);
            }else{
              inrspot = response['rows']['4']['Ask']
              io.sockets.emit('INRSPOTD',inrspot);
            }
          }else{
              inrspot = response['rows']['4']['Ask'];
              io.sockets.emit('INRSPOT',inrspot);
          }
        }
      });
      request('https://api.datakick.in/REST/harshJSONGS?API_Key=4abeca6d655f35eb5f32d8852efaf70d', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        var response = res.body;
        if(response){
          goldmcx = response['rows']['GOLD'];
          silvermcx = response['rows']['SILVER'];
          io.sockets.emit('spotupdate', response);
        }
      });
      
}
setInterval(requestdata,500);