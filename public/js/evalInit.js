/**
 * New node file
 */


$(function() {
	

	 $("#demo_pag1").bs_pagination({
	    currentPage: $('#post-container').attr('page'),
		totalPages: $('#post-container').attr('pages'),
		visiblePageLinks: 5,
		  
		showGoToPage: true,
		showRowsPerPage: true,
		showRowsInfo: false,
		showRowsDefaultInfo: true,
	    onChangePage: function(event, data) {
	        
	    	//get url parameter.
	    	var keyword=getUrlParameter("keyword");
	    	var link =window.location.pathname+"?page="+data.currentPage+"&perPage="+data.rowsPerPage;
	    	//if keyword exists,then add keyword parameter to link.
	    	if(keyword) link+="&"+keyword;
	    	//to link
	    	location.href= link;
	      }
     });
	
	//socketInit
    socket();
    //evaluationPostInit
    post();
    //autocompleteInit
    autocomplete();
})

var search =function(){
	
	location.href= window.location.pathname +"?keyword="+$('#keyword').val();
	
}


//autocomplete Init 
var autocomplete = function(){
	var id;
	
	$('#search').autocomplete({
      	source: function( request, response ) {
      		$.ajax({
      			url : '/course',
      			dataType: "json",
				data: {
				   text: request.term
				},
				success: function( data ) {
				    response($.map(data, function(item) {
						return {
							label: item.subject_nm+"-"+item.prof_nm,
							id : item._id
						}
					}));
			    }	
      		});
      	},
      	select: function( event, ui ) {
      		location.href="http://localhost:3000/eval/"+ui.item.id;
      	},
      	autoFocus: true,
      	minLength: 2      	
    });
}

//evaluation_post function
var post = function(){
    
	$('#evaluationForm').find('input,select,textarea').not('[type=submit]').jqBootstrapValidation({

        submitSuccess: function ($form, event) {
        	
        	 $.ajax({
                 url: $form.attr('action'),
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
}

 //socket_init function
var socket= function(){
    
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

//get url parameter by parameter name.
function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sURLVariables[i];
        }
    }
}        
