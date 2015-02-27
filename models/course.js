var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CourseSchema = new Schema({
	  year :{type:String,trim:true},
	  term: {type : String,trim : true},
	  subject_div2 : {type : String, trim : true},
	  subject_div : {type : String, trim : true},
	  subject_no : {type : String, trim : true},
	  class_div : {type : String, trim : true},
	  subject_nm :{type : String, trim : true},
	  sub_dept :{type : String, trim : true},
	  day_night_nm :{type : String, trim : true},
	  shyr : {type : Number},
	  credit:{type:Number},
	  class_nm :{type : String, trim : true},
	  prof_nm :{type : String, trim : true},
	  class_type :{type : String, trim : true},
	  tlsn_limit_count :{type:Number},
	  tlsn_count: {type:Number},
	  mainlist_Id :{type:Number}
});



CourseSchema.statics = {
		//load each course
		 load: function (id, cb) {
		    this.findOne({_id:id})
			    .exec(cb);
		  },

	    //load course lists
		  list: function (criteria, cb) {
		    this.find(criteria)
		        .select('subject_div sub_dept subject_nm prof_nm')
		        .exec(cb);
		  }
}

mongoose.model('Course', CourseSchema);