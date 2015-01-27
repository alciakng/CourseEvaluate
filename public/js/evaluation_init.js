/**
 * New node file
 */


$(function() {
//twitter bootstrap script
	
    evaluation_post();
    socket_init();
        
 })
 
 //evaluation_post function
 
var evaluation_post = function(){
    
    $("#evaluation_form").submit(function(){
        
        $.ajax({
                     url: "/evaluation_post",
                     type: "POST",
                     data: $("#evaluate_form").serializeArray(),
                     cache: false,
                     success: function() {
                     },
                     error: function() {
       
                     },
                 });
       
       
    })
 
 
}


 //socket_init function
var socket_init= function(){
    
 var socket = io.connect('http://localhost:3000');
 
  
 socket.emit('joinroom',{
     room:localStorage.getItem('roomName'),
     nickname : localStorage.getItem('nickName')            
 });

 //message 전송 이벤트
 $("#msgbox").keyup(function(event) {
     if (event.which == 13) {
         socket.emit('send_msg',{to:$('#to').val(),msg:$('#msgbox').val()});
         $('#msgbox').val('');
     }
 });
 

 // 새로운 사용자가 들어오거나, 사용자가 이름을 바꿨을때 "To" 리스트를 변경함
 socket.on('userlist',function(data){
     var users = data.users;
  
     $('#to').empty().append('<option value="ALL">ALL</option>');
     
     for(var i=0;i<data.users.length;i++){
         $('#to').append('<option value="'+users[i]+'">'+users[i]+"</option>");
     }
 });

 //메시지가 들어오면 붙임.
 socket.on('broadcast_msg',function(data){
     
     console.log(data.msg);
     $('#msgs').append(data.msg+'<BR>');
 });
 
 
 
 
};
