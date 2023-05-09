const express = require('express');
const path = require('path');
const PORT = 3000;

const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname+'/public')));
var count = 0;

io.on('connection', function(socket){
	
	socket.on('newuser',function(username){
		socket.broadcast.emit('update', username + ' entrou na conversa');
		count ++;
		io.emit('userCount', Math.abs(count));
	});
	socket.on('chat',function(message){
		socket.broadcast.emit('chat', message);
	});
	socket.on('disconnect', function(username){
		socket.broadcast.emit("update", 'Um usuário saiu da conversa');
		count --;
		io.emit('userCount', Math.abs(count));
	});
});

server.listen(process.env.PORT || PORT, ()=>{
	console.log(`O servidor agora está sendo executado na porta ${PORT}!`)
});