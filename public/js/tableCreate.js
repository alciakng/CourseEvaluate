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
    			    
        			//테이블 로우에 마우스 올리면 시간을 파싱해서 시간표에 음영을 보여준다.
    			    $('#course tbody').on( 'mouseover', 'tr', function () {
    			        var courseTime = $(this).children("td").eq(4).text();
    			        var TimeObjectArray = new Array();
    			        
    			        TimeObjectArray =  Parsing(courseTime);
    			        
    			        TimeObjectArray.forEach(function(element,index,array){
    			            
    			            element.time.forEach(function(eachtime,index,array){

                              var tds=documnet.getByElementId(eachtime).getElementByTagName('td');
                             
                              tds[element.day].style.backgroundColor="#2c3e50";
                              
    			            }) 
    			        });
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


//시간을 파싱하는 함수.
var Parsing = function(courseTime){
 
    //요일 맵핑 배열
    var dayMappingArray= ["월","화","수","목","금","토"];
    
    //split으로 시간을 파싱한다.
    var DaysAndTimesArray = new Array();
    var DayAndTimeArray = new Array();
    var TimesArray = new Array();
    
    //최종적으로 리턴할 객체
    var TimeObjectArray = new Array();
    
    //먼저 공백구분자로 요일별 시간표를 파싱한뒤 
    DaysAndTimesArray = courseTime.split(" ");
    //'/' 구분자로  요일별 시간을 알아낸다.
    DaysAndTimesArray.forEach(function(element,index,array){   
        DayAndTimeArray = element.split('/');
        //Day와 Time을 파싱한다.
        var Day = DayAndTimeArray[0].substring(0,1);
        var Time = DayAndTimeArray[0].substring(1);
        //Time을 나눈다. 
        TimesArray = Time.split(',');
        
        var TimeObject = new Object();
       
        //우선 객체를 하나 만들고
        TimeObject['day'] = dayMappingArray.indexOf(Day);
        
        TimeObject['time']= TimesArray;
       
        //Array에 push한다. 
        TimeObjectArray.push(TimeObject);
    
    });
    
    return TimeObjectArray;  
}

