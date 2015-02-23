/**
 * New node file
 */

var mongoose = require('mongoose');

var Eval = mongoose.model('Eval');
var User = mongoose.model('User');
var Course =mongoose.model('Course');



exports.load = function(req, res, next, id){
	
	Course.load(id, function (err,course) {
	    if (err) return next(err);
	    if (!eval) return next(new Error('not found'));
	    req.course =course;
	    next();
	  });
}

//강의 로딩 함수(나중에 init이랑 합쳐져야함)
exports.list = function(req,res){
	console.log("let's start courseLoad");
	
	var year =req.param("year");
	var term = req.param("term");
	
	console.log(year+term);
	
	var options ={
			year : year,
			term : term
	}
	
	Course.list(options,function(err,rows){
		console.log(rows);
		res.send(rows);
	});

	/*
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     "application/xml"	
	}
	
	 //api get options.옵션 content-type,encoding 아직 이해하지 못했음..
	 var options = {
			 url : 'http://wise.uos.ac.kr/uosdoc/api.ApiUcrCultTimeInq.oapi',
			 method:'GET',
			 headers:headers,
			 encoding:'binary',
			 qs: {'apiKey': '201501195EQW98965','year':'2014','term':'A10','subjectDiv':'""'}
	 };
	
	console.log("Let's Start courseLoad");
	//request 동작. 
	
	request(options, function (error, response, body) {
	    if(error) console.log("에러에러(wise 점검 및 인터넷 연결 안됨)");
	    if (!error && response.statusCode == 200) {
	    	
	    	//받아온 데이터의 euc-kr 형식을 ut8로 변환
	    	var data = new Buffer(body, 'binary');
	    	
	    	var data_utf8 = euckr2utf8.convert(data).toString();
	    
	    	
	    	
	    	//받아온 강의 데이터 xml 형식을 json으로 변환.
	    	var course_array = xm.load(data_utf8).root.mainlist.list;
	    	var dataSet= new Array();
			
	    	//받아온 데이터를 테이블 형식에 맞게  Array형식으로 변환.
			for(var i=0;i<course_array.length;i++){
				 var data= new Object(); 
				 data['majorDiv']=course_array[i].sub_dept.$cd;
				 data['curriculumDiv']=course_array[i].subject_div.$cd;
				 data['courseName']=course_array[i].subject_nm.$cd;
				 data['professorName']=course_array[i].prof_nm.$cd;
				 data['evaluation']='<a href="/eval/'+course_array[i].subject_nm.$cd+"("+course_array[i].prof_nm.$cd+")"+'" class="btn btn-danger btn-xs" data-title="evaluate"><span class="glyphicon glyphicon-pencil"> 평가하기</span></a>'
				 dataSet.push(data);
			};
	    	
	    	//Array를  클라이언트로 전송.
			res.send(dataSet);
	    
	    }
	});
	*/
	
		
};

//autocomplete 
exports.autocomplete = function(req,res){
	//search text
	var text=req.param("text");
	
	console.log(text);
	//option
	var options ={'subject_nm' : new RegExp(text, 'i')};
	
    //load recommend list
	Course.list(options,function(err,rows){
		console.log(rows);
		res.send(rows);
	});	
}