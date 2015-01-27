/**
 * New node file
 */


exports.socketfunction = function(httpServer){
    console.log("dddd");
    
    var io= require('socket.io').listen(httpServer);
    
    //client들이 들어가 있는 방들 
    var rooms =[];
    
    //io.sockets.on -->connection configuration
    io.on('connection',function(socket){
        
        socket.on('joinroom',function(data){
           //client쪽에서 넘어온 방정보로 방에 입장한다. 
            socket.join(data.room);
        
          //socket의 현재 방정보를 setting 한다. 
            socket.room=data.room;
          //socket setting nickname
            socket.nickname=data.nickname;
                var room = data.room;
                
                //닉네임설정.
                var nickname=data.nickname;
                console.log(data.room+"에"+data.nickname+"의입장");
            
           
                    
                   
                    //Create Room
                    if(rooms[room]==undefined){
                        console.log('room create :'+room);
                        rooms[room]= new Object();
                        rooms[room].socket_ids=new Object();
                    }
                    //Store current user's nickname and socket.id to MAP
                    rooms[room].socket_ids[nickname]= socket.id;
                    
                    //broadcast join message 
                    data ={msg :nickname+'님이 입장하셨습니다.'};
                    io.to(room).emit('broadcast_msg',data);
                    
                    //broadcast user list in the room 
                    io.to(room).emit('userlist',{users: 
                        Object.keys(rooms[room].socket_ids)});
               
            
       });
        
        socket.on('disconnect',function(data){
            var room = socket.room;
            
            //닉네임설정.
            var nickname=socket.nickname;
            
                //if(err) throw err;
                if(room != undefined
                    && rooms[room] != undefined){
                    
                    
                        console.log('nickname ' +nickname + ' has been disconnected');
                        // 여기에 방을 나갔다는 메세지를 broad cast 하기
                        if (nickname != undefined) {
                            if (rooms[room].socket_ids != undefined
                                && rooms[room].socket_ids[nickname] != undefined)
                                delete rooms[room].socket_ids[nickname];
                        }// if
                        data = {msg: nickname + ' 님이 나가셨습니다.'};
     
                        io.to(room).emit('broadcast_msg', data);
                        io.to(room).emit('userlist', {users: Object.keys(rooms[room].socket_ids)});
                  
                }
            //get
        });
        
        
        
        socket.on('send_msg',function(data){
           // socket.get('room',function(err,room) {
                //socket.get('nickname',function(err,nickname) {
            var room = socket.room;
            
            //닉네임설정.
            var nickname=socket.nickname;
            
                    console.log('in send msg room is ' + room);
                    data.msg = nickname + ' : ' + data.msg;
                    //자신을 제외하고 다른 클라이언트에게 보냄
                    if (data.to == 'ALL') socket.broadcast.to(room).emit('broadcast_msg', data); 
                    else {
                        // 귓속말
                        socket_id = rooms[room].socket_ids[data.to];
                        if (socket_id != undefined) {
     
                            data.msg ='(귓속말)' + data.msg;
                            io.to(socket_id).emit('broadcast_msg', data);
                        }// if
                    }
                    socket.emit('broadcast_msg', data);
              //  });
           // });
        });
        
        
        
  });
                    
                    
                    
}          
                    
 
                
                
  