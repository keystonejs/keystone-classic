var keystone = require('../');
var crypto = require('crypto');
var async = require('async');
var moment = require('moment');

exports.init = function() {
	var mongoose = keystone.mongoose;
	var Reset = new mongoose.Schema({
		token: {type: String, index: true},
		nonce: {type: String},
		expires: {type: Date, default: Date.now},
		verified: {type: Boolean, default: false}
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

exports.attemptResetMail = function(lookup, next) {
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
		next(new Error('e-mail must be string'));
	}
};

exports.verifyResetToken = function(token, nonce, req, res, next) {
	async.waterfall([
		function(callback) {
			var mongoose = keystone.mongoose,
				Reset = mongoose.model('App_User');
			Reset.findOne({token: token}).exec(function(err, reset) {
				callback(err, reset);
			});
		},
		function(reset, callback) {
			if (reset) {
				if (!reset.expires || !reset.nonce) return callback(new TypeError("Invalid reset data"));
				if (moment().diff(reset.expires) >= 0) return callback(new Error("Reset token expired"));
				if (nonce) {
					if (!reset.verified) return callback(new Error("Invalid reset data"));
					if (nonce !== reset.nonce) return callback(new Error("Nonce does not match"));
					reset.remove(function(err) {
						callback(err, reset);
					});
				} else {
					if (reset.verified) return callback(new Error("Cannot reuse token"));
					reset.verified = true;
					reset.save(function(err) {
						callback(err, reset);
					});
				}
			} else {
				callback(new Error('Reset token invalid'));
			}
		},
		function(reset, callback) {
			var User = keystone.list(keystone.get('user model'));
			User.model.findById(reset.id, function(err, user) {
				callback(err, {
					user: user,
					reset: reset
				});
			});
		}
	], next);
};

exports.sendResetPassword = function(callback) {

	var expires = moment().add(1, 'hour');
	var token = crypto.randomBytes(32).toString('base64');
	var nonce = crypto.randomBytes(32).toString('base64');
	var user = this;
	var Reset = keystone.mongoose.model('App_User');
	var data = {
		token: token,
		expires: expires,
		nonce: nonce,
		verified: false
	};

	Reset.update({_id: user.id}, data, {upsert: true}, function(err) {

		if (err) {
			return callback(err);
		}

		return new keystone.Email({
			templateName: 'reset-password'
		}).send({
				to: user.email,
				from: {
					name: keystone.get('name'),
					email: keystone.get('email')
				},
				subject: 'Reset your password',
				reset: {
					token: token,
					expires: expires,
					url: keystone.get('changepassword url') + '/' + encodeURIComponent(token)
				}
			}, callback);
	});
};
