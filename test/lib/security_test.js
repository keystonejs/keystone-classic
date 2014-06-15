var demand = require('must'),
	csrf = require('../../lib/security/csrf');

var REQ = function(method) {
	var rtn = {
		session: {},
		query: {},
		method: method || 'GET'
	};
	if (method == 'POST') {
		rtn.body = {};
	}
	return rtn;
}

var RES = function() {
	return {
		locals: {}
	};
}

var memory = {
	req: REQ(),
	post: REQ('POST'),
	res: RES()
};

describe('CSRF', function() {
	describe('getReqSecret()', function() {
		it('must return a new secret', function() {
			var secret = memory.firstSecret = csrf.getReqSecret(memory.req);
			secret.substr(secret.length - 2, 2).must.equal('==');
		});
		it('must return the same secret', function() {
			var secret = csrf.getReqSecret(memory.req);
			secret.must.equal(memory.firstSecret);
		});
	});
	describe('getReqToken()', function() {
		it('must find a token in req.body', function() {
			var req = { body: {} };
			req.body[csrf.TOKEN_KEY] = 'token';
			csrf.getReqToken(req).must.equal('token');
		});
		it('must find a token in req.query', function() {
			var req = { query: {} };
			req.query[csrf.TOKEN_KEY] = 'token';
			csrf.getReqToken(req).must.equal('token');
		});
		it('must default to an empty string', function() {
			csrf.getReqToken({}).must.equal('');
		});
	});
	describe('createToken()', function() {
		it('must create a new token', function() {
			memory.token = csrf.createToken(memory.req);
			memory.token.substr(memory.token.length - 1, 1).must.equal('=');
		});
	});
	describe('validate()', function() {
		it('must return true for valid tokens', function() {
			var valid = csrf.validate(memory.req, memory.token);
			valid.must.be.true();
		});
		it('must return false for invalid tokens', function() {
			var valid = csrf.validate(memory.req, 'invalid');
			valid.must.be.false();
		});
		it('must find the token in req', function() {
			memory.post.body[csrf.TOKEN_KEY] = csrf.createToken(memory.post);
			var valid = csrf.validate(memory.post);
			valid.must.be.true();
		});
	});
	describe('middleware()', function() {
		it('must add a token to res.locals', function(next) {
			var mw = csrf.middleware();
			var req = REQ(), res = RES();
			mw(req, res, function(err) {
				var token = res.locals[csrf.TOKEN_KEY];
				token.substr(token.length - 1, 1).must.equal('=');
				next();
			});
		});
		it('must validate tokens in the request body', function(next) {
			var mw = csrf.middleware();
			var req = REQ('POST'), res = RES();
			req.body[csrf.TOKEN_KEY] = csrf.createToken(req);
			mw(req, res, function(err) {
				demand(err).be.undefined();
				next();
			});
		});
		it('must pass an error and set statusCode to 403 with no valid token in the request body', function(next) {
			var mw = csrf.middleware();
			var req = REQ('POST'), res = RES();
			mw(req, res, function(err) {
				res.statusCode.must.equal(403);
				err.must.be.an.instanceof(Error);
				next();
			});
		});
		it('must ignore GET requests', function(next) {
			var mw = csrf.middleware();
			var req = REQ(), res = RES();
			mw(req, res, function(err) {
				demand(err).be.undefined();
				next();
			});
		});
	});
});
