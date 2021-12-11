const express = require('express');
const path = require('path');
const bodyParser=require("body-parser");
// const socket = require('socket.io');
const cors = require('cors');
const mongoose=require("mongoose");
// const Code = require('./models/code')
// const User = require('./models/user')

const mongourl="mongodb+srv://eduzone12345:eduzone12345@pair-programming.dostt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(mongourl,{useNewUrlParser: true,useUnifiedTopology: true},function(err, db) {
  if (err) throw err;
  console.log("Database connected!");
  
});
const app = express();



app.use(cors());
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.send("landing");
});

app.use("/register",require('./routes/userRoutes'));
app.use("/login", require("./routes/LoginRoute"));
app.use("/code", require("./routes/CodeRoute"));

const server = app.listen(process.env.PORT||5000,process.env.IP,function(){
    console.log('server has started')
   });

   const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

// test for connection
io.on('connection', socket => {
  console.log("id:", socket.id)
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Join room when 'room' event is emitted
  socket.on('room', data => {
    // console.log(",,,,,,,,,,,,",socket.rooms);
    socket.join(data.room, err => {
      if (err) console.error(err);
    });
    // console.log(`User ${socket.id} joined room ${data.room}`);
    // console.log(io.sockets.adapter.rooms);
  });

  // TODO: Handle leave room event when user switches room

  // handle coding event
  socket.on('coding', data => {
    socket.to(data.room).emit('code sent from server', data);
  });
});
