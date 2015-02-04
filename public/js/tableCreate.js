/**
 * New node file
 */
$(document).ready(function() {
  
    table_init();  
   
  
});

//table init
function table_init() {
		
	   //coulmn filter 생성

	   //ajax call 후에 data로 data-table 생성 및 column search available
	   $.ajax({
                url:'/courseLoad',
                dataType:'json',
                type:'GET', 
                success:function(result){ 
                  
                	//테이블 설정
    			    $('#course').bootstrapTable({
    						    data:result
    				});
    			 	    
				}
				
        });
	   
	   //majorFilter custom setup
	   $('#majorFilter').keyup(function () {

           var rex = new RegExp($(this).val(), 'i');
           $('.searchable tr').hide();
           $('.searchable tr').filter(function () {
               return rex.test($(this).text());
           }).show();

       })
	   
	   
	  
	   
};

