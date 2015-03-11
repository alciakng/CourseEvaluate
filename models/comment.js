/**
 * New node file
 */
/**
 * New node file
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	  body: { type : String},
	  user: { type : Schema.ObjectId, ref : 'User' },
	  comments: [{
	    body: { type : String},
	    user: { type : Schema.ObjectId, ref : 'User' },
	    to : {type :Schema.ObjectId, ref:'User'},
	    createdAt: { type : Date, default : Date.now }
	  }],
	  createdAt: { type : Date, default : Date.now },
	  evalId :{type :Schema.ObjectId, ref:'Eval'}
});

CommentSchema.methods = {

		  /**
		   * Save article and upload image
		   *
		   * @param {Object} images
		   * @param {Function} cb
		   * @api private
		   */

		  Save: function (cb) {
		    var self = this;
		    self.save(cb);
		  },

		  /**
		   * Add comment
		   *
		   * @param {User} user
		   * @param {Object} comment
		   * @param {Function} cb
		   * @api private
		   */

		  addComment: function (options,comment,cb) {
			 
		    this.comments.push({
		      body: comment.body,
		      user: options.user._id,
		      to:options.to._id
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

  CommentSchema.statics = {
		  load: function (id, cb) {
		    this.findOne({_id:id})
		      .populate('user', 'alias')
		      .populate('comments.user')
		      .exec(cb);
		  },

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

		mongoose.model('Comment', CommentSchema);
