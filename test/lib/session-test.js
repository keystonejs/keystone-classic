var keystone = require('../..'),
	demand = require('must'),
	sinon = require('sinon');

describe('Keystone.session', function() {

	describe('keystone.session.doSignin()', function() {
		// mock args for doSignin(user, req, res, onSuccess)
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
				keystone.session.doSignin(user, req, res, onSuccess);

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
				keystone.session.doSignin(user, req, res, onSuccess);

				sinon.assert.calledOnce(req.session.regenerate);

				req.user.must.equal(user);
				req.session.userId.must.equal(user.id);				

				sinon.assert.callCount(res.cookie, 0);

				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});

		});

		describe('with invalid args', function() {
			beforeEach(function() {
				sinon.stub(console, 'error');
				sinon.stub(process, 'exit').throws('ProcessExit');
			});

			afterEach(function() {
				console.error.restore();
				process.exit.restore();				
			});

			it('should error when called less then 4 args', function() {
				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin();
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires user, req and res objects, and an onSuccess callback.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}

				console.error.reset();
				process.exit.reset();				

				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin(user);
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires user, req and res objects, and an onSuccess callback.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}

				console.error.reset();
				process.exit.reset();				

				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin(user, req);
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires user, req and res objects, and an onSuccess callback.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}

				console.error.reset();
				process.exit.reset();				

				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin(user, req, onSuccess);
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires user, req and res objects, and an onSuccess callback.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}
			});

			it('should error when user arg is not an object', function() {
				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin('user', req, res, onSuccess);
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires user to be an object.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}
			});

			it('should error when req arg is not an object', function() {
				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin(user, 'req', res, onSuccess);
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires req to be an object.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}
			});

			it('should error when res arg is not an object', function() {
				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin(user, req, 'res', onSuccess);
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires res to be an object.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}
			});

			it('should error when onSuccess arg is not a function', function() {
				try {
					keystone.set('cookie signin', true);
					keystone.session.doSignin(user, req, res, 'onSuccess');
				} catch(e) {
					sinon.assert.calledOnce(console.error);
					sinon.assert.calledWithExactly(console.error, '\nkeystone.sesson.doSignin requires onSuccess to be a function.\n');
					sinon.assert.calledOnce(process.exit);
					sinon.assert.calledWithExactly(process.exit, 1);
				}
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
