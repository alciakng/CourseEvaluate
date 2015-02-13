/**
 * New node file
 */
//request 모듈.학교 api 받아오기 위해 사용.
var request = require('request');
//xml-to-json 모듈
var xm = require('xml-mapping');
//인코딩 모듈
var Iconv  = require('iconv').Iconv;
var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
//암호화 모듈
var bcrypt = require('bcrypt-nodejs');
//mongoose와 eval 모델 정의
var mongoose = require('mongoose');
var Eval = mongoose.model('Eval');


//로그인이 되어있는지 확인하는 함수.
exports.ensureAuthenticated= function(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면 index Load
    res.redirect('/');
}

//indexpage loading
exports.index =function(req,res){
	  Eval.recentList(function(err,rows){
	    	res.render("index",{recentLists:rows})
	    });
}

//userpage loading 함수
exports.user = function(req,res){
	//userpage Load
	 Eval.recentList(function(err,rows){
		    	res.render("user",{recentLists:rows})
	 });
}


//강의 로딩 함수(나중에 init이랑 합쳐져야함)
exports.courseLoad = function(req,res){

	
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
};


//autocomplete
exports.courseSearch = function(req,res){
	//input에 입력된 keyword
	var keyword = req.body.term;
	
	console.log(keyword);
	
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     "application/xml"	
	}
	
	 //api get options.옵션 content-type,encoding 아직 이해하지 못했음..
	 var options = {
			 url : 'http://wise.uos.ac.kr/uosdoc/api.ApiApiSubjectList.oapi',
			 method:'GET',
			 headers:headers,
			 encoding:'binary',
			 qs: {'apiKey': '201501195EQW98965','year':'2014','term':'A10','subjectNm':keyword}
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
	    	var courseData = xm.load(data_utf8).root.mainlist.list;
	    	
	    	//Array를  클라이언트로 전송.
			res.send(courseData);
	    }
	});
}

