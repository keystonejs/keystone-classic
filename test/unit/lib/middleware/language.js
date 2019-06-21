var demand = require('must');
var sinon = require('sinon');
var assign = require('object-assign');
var language = require('../../../../lib/middleware/language');

var COOKIE_NAME_ARG = 0;
var COOKIE_LANGUAGE_ARG = 1;
var COOKIE_OPTIONS_ARG = 2;

function getNoop () { return function noop () {} }

function mockRequest (acceptLanguage, storedLanguage) {
	var args = [].slice.call(arguments);
	var options = typeof args[0] === 'object' ? args[0] : {};

	if (Object.keys(options).length) {
		acceptLanguage = options.acceptLanguage;
	}

	return assign({
		locals: {},
		headers: {
			'accept-language': acceptLanguage
		},
		cookies: {
			language: storedLanguage
		},
		query: {},
		cookie: getNoop()
	}, options);
};

function mockResponse () {
	return {
		redirect: sinon.spy(),
		cookie: sinon.spy()
	};
}

function keystoneOptions (options) {
	options = assign({}, options);

	return {
		get: function (key) {
			return options[key];
		}
	};
}

function mockApp () {
	return {
		use: sinon.spy()
	}
}

function getCookieName (res) {
	return res.cookie.getCall(0).args[COOKIE_NAME_ARG];
}

function getCookieLanguage (res) {
	return res.cookie.getCall(0).args[COOKIE_LANGUAGE_ARG];
}

function getCookieOptions (res, option) {
	return res.cookie.getCall(0).args[COOKIE_OPTIONS_ARG][option];
}

describe('language', function () {
	it('must allow Accept-Language selection', function () {
		var keystone = keystoneOptions({
			'language options': {
				'supported languages': ['en-US', 'zh-CN']
			}
		});
		var expected = 'zh-CN';
		var req = mockRequest({
			acceptLanguage: 'zh-CN;q=1,en-US;q=0.8'
		});
		var res = mockResponse();
		var middleware = language(keystone);

		middleware(req, res, getNoop());

		demand(getCookieLanguage(res)).eql(expected);
	});

	describe('must set language', function () {
		describe('with default options', function () {

			it('must create a language cookie', function (done) {

				var keystone = keystoneOptions();
				var res = mockResponse();
				var expected = 'en-US';

				language(keystone)(mockRequest(), res, function (err) {
					demand(err).be(undefined);
					demand(getCookieLanguage(res)).eql(expected);
					done();
				});
			});

		});

		describe('with custom cookie name', function () {
			it('must create a custom language cookie', function (done) {

				var keystone = keystoneOptions({
					'language options': {
						'language cookie': 'locale'
					}
				});
				var res = mockResponse();
				var expected = 'locale';

				language(keystone)(mockRequest(), res, function (err) {
					demand(err).be(undefined);
					demand(getCookieName(res)).eql(expected);
					done();
				});
			});

		});

		describe('with custom cookie options', function () {
			it('must create a custom language cookie', function (done) {
				var keystone = keystoneOptions({
					'language options': {
						'language cookie options': {
							maxAge: 24*3600*1000,
							secure: true
						}
					}
				});
				var res = mockResponse();
				var expectedSecure = true;
				var expectedMaxAge = 86400000

				language(keystone)(mockRequest(), res, function (err) {
					demand(err).be(undefined);
					demand(getCookieOptions(res, 'secure')).eql(expectedSecure);
					demand(getCookieOptions(res, 'maxAge')).eql(expectedMaxAge);
					done();
				});
			});

		});
	});

	describe('must create language route', function () {
		describe('with default options', function () {
			it('must create /language route to change language', function () {

				var keystone = keystoneOptions();
				var req = mockRequest({
					acceptLanguage: 'zh-CN;q=0.8,en-US;q=1',
					storedLanguage: 'zh-CN',
					url: '/languages/en-US'
				});
				var res = mockResponse();
				var middleware = language(keystone);
				var expected = 'en-US';

				middleware(req, res, getNoop());

				demand(res.redirect.calledOnce).eql(true);
				demand(res.cookie.calledOnce).eql(true);
				demand(getCookieLanguage(res)).eql(expected);
			});
		});

		describe('with default options', function () {
			it('must create custom route to change language', function () {

				var keystone = keystoneOptions({
					'language options': {
						'language select url': '/locale/{language}'
					}
				});
				var req = mockRequest({
					acceptLanguage: 'zh-CN;q=0.8,en-US;q=1',
					storedLanguage: 'zh-CN',
					url: '/locale/en-US'
				});
				var res = mockResponse();
				var middleware = language(keystone);
				var expected = 'en-US';

				middleware(req, res, getNoop());

				demand(res.redirect.calledOnce).eql(true);
				demand(res.cookie.calledOnce).eql(true);
				demand(getCookieLanguage(res)).eql(expected);
			});
		});
	});

	describe('query string language setting', function () {
		describe('with default query name', function () {
			it('must allow query string language setting', function () {
				var keystone = keystoneOptions({
					'language options': {
						'supported languages': ['en-US', 'zh-CN']
					}
				});
				var expected = 'en-US';
				var req = mockRequest({
					acceptLanguage: 'zh-CN;1,en-US;q=0.8',
					query: {
						language: 'en-US'
					}
				});
				var res = mockResponse();
				var middleware = language(keystone);

				middleware(req, res, getNoop());

				demand(getCookieLanguage(res)).eql(expected);
			});
		});

		describe('with custom query name', function () {
			it('must allow query string language setting', function () {
				var keystone = keystoneOptions({
					'language options': {
						'supported languages': ['en-US', 'zh-CN'],
						'language query name': 'locale'
					}
				});
				var expected = 'en-US';
				var req = mockRequest({
					acceptLanguage: 'zh-CN;1,en-US;q=0.8',
					query: {
						locale: 'en-US'
					}
				});
				var res = mockResponse();
				var middleware = language(keystone);

				middleware(req, res, getNoop());

				demand(getCookieLanguage(res)).eql(expected);
			});
		});
	});
});
