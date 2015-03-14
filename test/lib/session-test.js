var keystone = require('../..'),
	sinon = require('sinon');

describe('Keystone.session', function() {

	describe('keystone.session.signinWithUser()', function() {
		// mock args for signinWithUser(user, req, res, onSuccess)
		var res = {
				cookie: sinon.stub()
			},
			onSuccess = sinon.stub(),
			user,
			req;

		function resetMocks() {
			user = {
				id: 'USERID',
				password: 'PASSWORD'
			};
			req = {
				user: null,
				session: {
					userId: null,
					regenerate: function(callback) {
						callback();
					}
				}
			};
		}

		before(function() {
			keystone.get('cookie secret', 'SECRET');
			keystone.set('user model', 'User');
		});

		beforeEach(function() {
			resetMocks();
			sinon.spy(req.session, 'regenerate');
		});

		afterEach(function() {
			req.session.regenerate.reset();
			res.cookie.reset();
			onSuccess.reset();
		});

		describe('with valid args, "cookie signin" on', function() {

			it('should regenerate session, set user, session.userId, and res.cookie', function() {
				keystone.set('cookie signin', true);
				keystone.session.signinWithUser(user, req, res, onSuccess);

				sinon.assert.calledOnce(req.session.regenerate);

				req.user.must.equal(user);
				req.session.userId.must.equal(user.id);				

				sinon.assert.calledOnce(res.cookie);
				sinon.assert.calledWith(res.cookie, 'keystone.uid');

				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});

		});

		describe('with valid args, "cookie signin" off', function() {

			it('should regenerate session, set user, session.userId', function() {
				keystone.set('cookie signin', false);
				keystone.session.signinWithUser(user, req, res, onSuccess);

				sinon.assert.calledOnce(req.session.regenerate);

				req.user.must.equal(user);
				req.session.userId.must.equal(user.id);				

				sinon.assert.callCount(res.cookie, 0);

				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});

		});

		describe('with invalid args', function() {
			it('should error when called less then 4 args', function() {
				function callWithNoArgs() {
					keystone.session.signinWithUser();
				}
				callWithNoArgs.must.throw('keystone.sesson.signinWithUser requires user, req and res objects, and an onSuccess callback.');

				function callWithOneArg() {
					keystone.session.signinWithUser(user);
				}
				callWithOneArg.must.throw('keystone.sesson.signinWithUser requires user, req and res objects, and an onSuccess callback.');

				function callWithTwoArgs() {
					keystone.session.signinWithUser(user, req);
				}
				callWithOneArg.must.throw('keystone.sesson.signinWithUser requires user, req and res objects, and an onSuccess callback.');

				function callWithThreeArgs() {
					keystone.session.signinWithUser(user, req, res);
				}
				callWithOneArg.must.throw('keystone.sesson.signinWithUser requires user, req and res objects, and an onSuccess callback.');
			});

			it('should error when user arg is not an object', function() {
				function callWithInvalidUser() {
					keystone.session.signinWithUser('user', req, res, onSuccess);
				}				
				callWithInvalidUser.must.throw('keystone.sesson.signinWithUser requires user to be an object.');
			});

			it('should error when req arg is not an object', function() {
				function callWithInvalidReq() {
					keystone.session.signinWithUser(user, 'req', res, onSuccess);
				}				
				callWithInvalidReq.must.throw('keystone.sesson.signinWithUser requires req to be an object.');
			});

			it('should error when res arg is not an object', function() {
				function callWithInvalidRes() {
					keystone.session.signinWithUser(user, req, 'res', onSuccess);
				}				
				callWithInvalidRes.must.throw('keystone.sesson.signinWithUser requires res to be an object.');
			});

			it('should error when onSuccess arg is not a function', function() {
				function callWithInvalidCallback() {
					keystone.session.signinWithUser(user, req, res, 'onSuccess');
				}				
				callWithInvalidCallback.must.throw('keystone.sesson.signinWithUser requires onSuccess to be a function.');
			});

		});

	});

	// TODO: test keystone.session.signin()
	// describe('keystone.session.signin()');

	// TODO: test keystone.session.signout()
	// describe('keystone.session.signout()');

	// TODO: test keystone.session.persist()
	// describe('keystone.session.persist()');

	// TODO: test keystone.session.keystoneAuth()
	// describe('keystone.session.keystoneAuth()');

});
