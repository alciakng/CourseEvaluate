/**
 * New node file
 */
var mongoose = require('mongoose');

//암호화 하는 간단한 모듈.
var bcrypt = require('bcrypt-nodejs');

/*crypto module(현재 사용하지 않음)
사용하기 까다로움.
salt변수 추가적으로 필요.나중에 사용.
*/
var crypto = require('crypto');

var Schema = mongoose.Schema;

/*userSchema
there is a value named salt using crypto.
I'll use this value later.
*/
var UserSchema = new Schema({
	
	  email: { type: String},
	  hashed_password: { type: String},
	  major : {type:String},
	  alias : {type:String},
	  introduction:{type:String,default:''},
	  notices: [{
	    from : { type : Schema.ObjectId, ref : 'User' },
	    about : { type : Schema.ObjectId},
	    createdAt: {type : Date, default : Date.now}
	  }]
	  
});

//virtual Schema is setting hashed_password
UserSchema
.virtual('password')
.set(function(password) {
  this._password = password;
  this.hashed_password = bcrypt.hashSync(password);
})
.get(function() { return this._password });


UserSchema.methods = {
	      //사용자 인증
		  authenticate:function (password) {
		    return bcrypt.compareSync(password,this.hashed_password);
		  },
		  addNotice:function(from,url){
				  this.notices.push({
					  from : from.alias,
					  commentURL :url
				  })
				  this.save();
		  },
		  removeNotice:function(noticeId,cb){
			  var doc = this.notices.id(noticeId).remove();
			  this.save(cb);
		  }
}
		/**
		 * Statics
		 */
UserSchema.statics = {

		  /**
		   * Load
		   *
		   * @param {Object} options
		   * @param {Function} cb
		   * @api private
		   */
		  load: function (criteria, cb) {
		    this.findOne(criteria)
		      .exec(cb);
		  }
}

mongoose.model('User', UserSchema);