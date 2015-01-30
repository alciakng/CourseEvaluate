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
    						               ],
                             //"scrollY":        "200px",
                             //"scrollCollapse": true
    						
    				});
    			
    			    //mouseover Event 정의    
    			    MouseEvent("mouseover");
    			    
    			    //mouseout Event 정의
    			    MouseEvent("mouseout");
    			    
    			    //mouseclick event 정의
    			    MouseClickEvent();
    			    
    			    
    			    
				 //coulmn마다  검색필터 주기 
				  $('#course thead th').each( function () { 
					  var title = $('#course thead th').eq( $(this).index() ).text();
				 	 if($(this).index()!=5){
				 		 //인덱스가 4인경우는 아이디 timeSearch를 부여한다(시간표를 클릭했을 때 그시간으로 서칭을 가능하게 하려고)
				 		 if($(this).index()==4){
				 		 $(this).html('<input type="text" style="width:100%" id="timeSearch" placeholder='+title+'/>');
				 		 }else
				 		 $(this).html('<input type="text" style="width:100%" placeholder='+title+'/>');
				 	 }
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
        TimesArray= Time.split(',');
       //시간대의 0자를 떼고 TimesArray를 만들어낸다.
     
        
        
        var TimeObject = new Object();
       
        //우선 객체를 하나 만들고
        TimeObject['day'] = dayMappingArray.indexOf(Day)+1;
        
        TimeObject['time']= TimesArray;
        
       
        //Array에 push한다. 
        TimeObjectArray.push(TimeObject);
    
    });
    
    return TimeObjectArray;  
}

//마우스 클릭이벤트
var MouseClickEvent = function(){
	
	$('#course tbody').on("click", 'tr', function () {
    
		var courseName = $(this).children("td").eq(2).text();
		var courseTime = $(this).children("td").eq(4).text();
    	var TimeObjectArray = new Array();
    	var RandomColor = getRandomColor();
    	var Taken,removeCourseDelimiter;
    	
    	//강의시간파싱
    	TimeObjectArray= Parsing(courseTime);
    	
    	
        	//이미 차지된 강의인지 확인.
        	Taken=false;
            TimeObjectArray.forEach(function(element,objectIndex,objectArray){
            	 element.time.forEach(function(eachtime,elementIndex,elementArray){
                     var td= document.getElementById(eachtime+element.day);
                     if(td.hasAttribute('delimiter')){
                    	 Taken=true;
                    	 removeCourseDelimiter = td.getAttribute('delimiter');
                     }
        	    }) 
        	})
  
        
    	//만약 이미 강의가  td에 들어가 있다면 
    	if(Taken){
             		if(confirm("강의가 겹칩니다. 기존 강의를 빼고 추가하시겠습니까?")==true){
             			 removeCourseInTable(removeCourseDelimiter);
             		  }
             		  //만약 기존강의를 제거 하지않는 다고 하면 그냥 빠져나간다.
             		  else{
             			  exit;
             			  
             		  }
             		 
             	  }
    	
    	 TimeObjectArray.forEach(function(element,objectIndex,objectArray){
             
             
             element.time.forEach(function(eachtime,elementIndex,elementArray){
            	 
            	 var td= document.getElementById(eachtime+element.day);
              
				 td.innerHTML ="<strong style='font-size:9px'>"+courseName+"</strong>";
			     td.style.backgroundColor=RandomColor;
			     td.setAttribute('color',RandomColor);
			     td.setAttribute('delimiter',courseName+courseTime);
			     td.setAttribute("day",element.day);		
			     //클릭시 작동함수. 	
			     td.onclick=function(){
			    	 if(confirm("강의를 삭제하시겠습니까?")==true){
			    		 removeCourseInTable(td.getAttribute('delimiter'));
			    	 } 
			     };
			     
             	});
             });
	
	
	})
}

//마우스 모션이벤트
var MouseEvent = function(eventname){

    //테이블 로우에 마우스 올리면 시간을 파싱해서 시간표에 음영을 보여준다.
    $('#course tbody').on( eventname, 'tr', function () {
    	
        var courseTime = $(this).children("td").eq(4).text();
        var TimeObjectArray = new Array();
        var Taken;
        
        
        
        //강의시간 파싱
        TimeObjectArray =  Parsing(courseTime);
        
       
       
        //강의시간 오브젝트를 돌면서 함수실행.. 
        TimeObjectArray.forEach(function(element,objectIndex,objectArray){
            
            
            element.time.forEach(function(eachtime,elementIndex,elementArray){
              
              
              var td= document.getElementById(eachtime+element.day);
              
              //mouseover이벤트인 경우와 mouseout일때에는 배경색이 
              if(eventname=="mouseover"){  
              td.style.backgroundColor="#BCFFB5";
              }else if(eventname=="mouseout"){
            	  //만약 이미 강의가 들어가있다면 그색으로 다시 변경
            	  if(td.hasAttribute('color'))
            		  td.style.backgroundColor=td.getAttribute('color');
            	  //아니면 흰색으로 변경
            	  else td.style.backgroundColor="#ffffff";
              }
             
        });
    });
})}

//랜덤컬러를 받아옴.
var getRandomColor= function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


var removeCourseInTable = function(removeCourseDelimiter){
	
	 //루프를 돌면서 시간표에서 기존강의 정보를 제거해준다.
    var table = document.getElementById('timetable');
	 
	for(var i=0,row;row=table.rows[i]; i++) {
	    for(var j=0,col;col=row.cells[j]; j++) {
	        if(col.getAttribute('delimiter')==removeCourseDelimiter){
	        	col.style.backgroundColor="#ffffff";
	        	col.innerHTML="";
	        	col.removeAttribute('color');
	        	col.removeAttribute('delimiter');
	        	col.removeAttribute('day');
	        	col.onclick=function(){
	        		if(confirm("이 시간대의 강의를 검색하시겠습니까?")==true){
	        			document.getElementById('timeSearch').innerHTML='화02';
	        			
	        		}
	        	}	
	        }
	    }
	}
}



