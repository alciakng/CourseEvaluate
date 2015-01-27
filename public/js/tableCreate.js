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
			    var table= $('#course').DataTable({
						 "data": result,
						 //search input 라벨 제거
						 "oLanguage": { "sSearch": "" },
						 //dom option dom배치 결정
						 "dom": '<"wrapper"rtp>',
						 //orderabble:false 정렬기능 없애기,
						 "columnDefs": [ { "targets": 5, "orderable": false },
						                 {"width": "20%","targets":0},
						                 {"width": "20%","targets":1},
						                 {"width": "20%","targets":2},
						                 {"width": "20%","targets":3},
						                 {"width": "25%","targets":4}
						               ]
						
				});
			    
			    $('#course tbody').on( 'click', 'tr', function () {
			        $(this).toggleClass('s elected');
			    });
			    
				
				 //coulmn마다  검색필터 주기 
				  $('#course thead th').each( function () { 
					  var title = $('#course thead th').eq( $(this).index() ).text();
				 	 if($(this).index()!=5)
         			 $(this).html('<input type="text" style="width:100%" placeholder='+title+'/>');
			 	 
   				     });
		
				//검색필터에 search 기능 주기 
				table.columns().eq( 0 ).each( function ( colIdx ) {
					$('input', table.column( colIdx ).header() ).on('keyup change', function () {
						table
						.column(colIdx)
						.search(this.value)
						.draw();
					});
				  });   				
				}
				
        });
};

