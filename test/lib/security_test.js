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
});
