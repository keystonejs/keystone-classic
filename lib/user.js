var keystone = require('../'),
	crypto = require('crypto'),
	async = require('async'),
	moment = require('moment');

exports.init = function() {
	var mongoose = keystone.mongoose,
		Reset = new mongoose.Schema({
			token  : {type: String, index: true},
			expires: {type: Date, default: Date.now}
		}, {collection: keystone.prefixModel('App_User')});
	mongoose.model('App_User', Reset);
};

/**
 * Checks if a user with the given the lookup email exists in the database
 *
 * @param {Object} lookup - must contain email
 * @param {function()} onSuccess callback, is passed the User instance
 * @param {function()} onFail callback
 */

exports.attemptReset = function(lookup, next) {
	var User = keystone.list(keystone.get('user model'));
	if ('string' === typeof lookup.email) {
		// match email address
		User.model.findOne({email: lookup.email}).exec(function(err, user) {
			if (err) {
				return next(err);
			}
			if (user && user.sendResetPassword) {
				return user.sendResetPassword(next);
			}
			next();
		});
	} else {
		next(new Error('todo: e-mail must be string'));
	}
};

exports.attemptSignin = function(token, req, res, next) {
	async.waterfall([
		function(callback) {
			var mongoose = keystone.mongoose,
				Reset = mongoose.model('App_User');
			Reset.findOne({token: token}).exec(function(err, reset){
				callback(err, reset);
			});
		},
		function(reset, callback){
			var userId,
				err;
			if(reset){
				if(!reset.expires || moment().diff(reset.expires) >= 0 || !reset.token || reset.token !== token){
					err = new Error("Reset token invalid");
				}else{
					userId=reset.id;
				}
				reset.remove(function(){
					callback(err, userId);
				});
			}else{
				callback(new Error("Reset token invalid"));
			}
		},
		function(userId, callback){
			var User = keystone.list(keystone.get("user model"));
			User.model.findById(userId, callback);
		},
		function(user, callback) {
			keystone.session.signinWithUser(user, req, res, function(user) {
				callback(null, user);
			});
		}
	], next);
};

exports.sendResetPassword = function(callback) {

	var expires = moment().add(1, 'hour'),
		token = crypto.randomBytes(32).toString('base64'),
		user = this,
		Reset = keystone.mongoose.model('App_User'),
		data = {
			token  : token,
			expires: expires
		};

	Reset.update({_id: user.id}, data, {upsert: true}, function(err) {

		if (err) {
			return callback(err);
		}

		return new keystone.Email({
			templateName: 'reset-password'
		}).send({
				to     : user.email,
				from   : {
					name : keystone.get('name'),
					email: keystone.get('email')
				},
				subject: 'Reset your password',
				reset  : {
					token  : token,
					expires: expires,
					url    : keystone.get("changepassword url") + "/" + encodeURIComponent(token)
				}
			}, callback);
	});
};
