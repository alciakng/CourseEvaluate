/**
 * New node file
 */




$(function() {

    //commentPost
    commentPost();
})


var commentPost = function(){
	
	$('#commentForm').find('input,select,textarea').not('[type=submit]').jqBootstrapValidation({
		
		  submitSuccess: function ($form, event) {
			  var to = $("#to").attr('to');
			
			  console.log(to);
		
	        	 $.ajax({
	                 url: $form.attr('action')+"/?to="+to,
	                 type: "POST",
	                 data: $form.serialize(),
	                 cache: false,
	                 success: function(result){                    	
	                	 if(result.message=="error") alert("댓글을 다는데 에러가 발생하였습니다! 인터넬 연결 상태를 확인하세요. 혹은 서버 과부하 오류 일 수 있습니다.");
	                 },
	                 error: function() {
	                	
	                 },
	        	 });

	          // will not trigger the default submission in favor of the ajax function
	          event.preventDefault();
	          
	        }
	})
};