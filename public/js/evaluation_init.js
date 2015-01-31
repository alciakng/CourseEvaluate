/**
 * New node file
 */


$(function() {
//twitter bootstrap script
	
   // evaluation_post();
    socket_init();
    
    $('#evaluationForm').find('input,select,textarea').not('[type=submit]').jqBootstrapValidation({

        submitSuccess: function ($form, event) {
        	var courseName = document.getElementById("room_name").innerHTML;

        	 $.ajax({
                 url: $form.attr('action')+"/"+courseName,
                 type: "POST",
                 data: $form.serialize(),
                 cache: false,
                 success: function(result){                    	
                	 if(result.message=="error") alert("평을 올리는데 에러가 발생하였습니다! 인터넬 연결 상태를 확인하세요. 혹은 서버 과부하 오류 일 수 있습니다.");
                	 else{
                		alert($("#evaluate_form").serializeArray());
                	 }
                 },
                 error: function() {
                	
                 },
        	 });

          // will not trigger the default submission in favor of the ajax function
          event.preventDefault();
         
        }

     });
})

//evaluation_post function
 
var evaluation_post = function(){
    
    $("#evaluation_form").submit(function(){ 	
       
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
