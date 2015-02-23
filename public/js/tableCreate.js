/**
 * New node file
 */
$(document).ready(function() {
   //table_init
   courseLoad(" 2013 "," A10 ");
   
});

function courseLoad(year,term){
	
	  var criteria = {
	      year:year,
		  term:term
	  };
	  /*
	  $.post( "/courseLoad",criteria).done(function(data){
		  $('#course').bootstrapTable("load",data);
	  });
	  */
	
	  $.ajax({
          url:'/course',
          dataType:'json',
          type:'POST',
          data:{
        	  year:year,
        	  term:term
          },
          success:function(result){ 
          	//테이블 설정
			    $('#course').bootstrapTable('destroy');
			    $('#course').bootstrapTable({data:result});	
			}
			
      });
     
}

function operateFormatter(value, row, index) {
    return [
        '<a class="btn btn-success btn-sm" href="/eval/'+row._id+'">',
        '<strong>평가하기</strong>',
        '</a>'
    ].join('');
}
