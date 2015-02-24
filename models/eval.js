/**
 * New node file
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EvalSchema = new Schema({
	  courseId :{type:Schema.ObjectId,ref:'Course'},
	  title: {type : String,trim : true},
	  body: {type : String, trim : true},
	  user: {type : Schema.ObjectId, ref : 'User'},
	  comments: [{
	    body: { type : String},
	    user: { type : Schema.ObjectId, ref : 'User' },
	    createdAt: { type : Date, default : Date.now }
	  }],
	  difficulty:{type:Number},
	  satisfaction:{type:Number},
	  totalScore:{type:Number},
	  createdAt  : {type : Date, default : Date.now}
});

EvalSchema.methods = {

		  /**
		   * Save article and upload image
		   *
		   * @param {Object} images
		   * @param {Function} cb
		   * @api private
		   */

		  Save: function (cb) {
		    var self = this;
		    self.save();
		  },

		  /**
		   * Add comment
		   *
		   * @param {User} user
		   * @param {Object} comment
		   * @param {Function} cb
		   * @api private
		   */

		  addComment: function (user,comment,cb) {
			 
		    this.comments.push({
		      body: comment.body,
		      user: user._id
		    });
		    
		    
		    this.save(cb);
		  },

		  /**
		   * Remove comment
		   *
		   * @param {commentId} String
		   * @param {Function} cb
		   * @api private
		   */

		  removeComment: function (commentId, cb) {
		    var index = utils.indexof(this.comments, { id: commentId });
		    if (~index) this.comments.splice(index, 1);
		    else return cb('not found');
		    this.save(cb);
		  }
		  
		
}

		/**
		 * Statics
		 */

		EvalSchema.statics = {

		  /**
		   * Find article by id
		   *
		   * @param {ObjectId} id
		   * @param {Function} cb
		   * @api private
		   */

		  load: function (id, cb) {
		    this.findOne({_id:id})
		      .populate('user', 'alias')
		      .populate('comments.user')
		      .exec(cb);
		  },
		  
		  //최근 평가를 불러온다.
		  recentList : function(cb){
			  this.find()
			    .populate('user','alias')
			  	.sort('-CreatedAt')
			  	.limit(2)
			  	.exec(cb)
		  },

		  /**
		   * List articles
		   *
		   * @param {Object} options
		   * @param {Function} cb
		   * @api private
		   */
		  list: function (options, cb) {
			// ||연산자는 앞이 참이면 앞에 인자를 앞이 거짓이면 뒤의 인자를 반환한다.
		    var criteria = options.criteria || {};
		    
		    this.find(criteria)
		      .populate('user', 'alias')
		      .sort({'createdAt': -1}) // sort by date
		      .limit(options.perPage)
		      .skip(options.perPage * options.page)
		      .exec(cb);
		  }
		  
		  
		  
		  
		}

		mongoose.model('Eval', EvalSchema);
