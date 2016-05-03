var _ = require('underscore');
var fs = require('fs');
var keystone = require('../');
var mandrillapi = require('mandrill-api');
var mailgunapi = require('mailgun-js');
var juice = require('juice');
var moment = require('moment');
var path = require('path');
var util = require('util');
var utils = require('keystone-utils');

var templateCache = {};

// Get view engine
var emailsEngine, emailsEnginelib;
if (keystone.get('custom engine')) {
	emailsEngine = keystone.get('view engine');
	emailsEnginelib = keystone.get('custom engine');
} else {
	emailsEngine = 'jade';
	emailsEnginelib = require('jade');
}

var defaultConfig = {
	templateExt: emailsEngine,
	templateEngine: emailsEnginelib,
	templateBasePath: path.normalize(path.join(__dirname, '..', 'templates', 'helpers', 'emails')),
};
if (!_.isEqual(keystone.get('email transport'), 'mailgun')) {
	defaultConfig.mandrill = {
		track_opens: true,
		track_clicks: true,
		preserve_recipients: false,
		inline_css: true,
	};
	defaultConfig.templateMandrillName = null; // Mandrill template
	defaultConfig.templateForceHtml = false; // Force html render
}

/** Custom Errors */

// TOTO: Uses arguments.callee for the stack trace, which prevents optimisation.
// I've marked these to be ignored by jshint but we should find a better way.

var ErrorNoEmailTemplateName = function() {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee);
	this.message = 'No email templateName specified.';
	this.name = 'ErrorNoEmailTemplateName';
};
util.inherits(ErrorNoEmailTemplateName, Error);

var ErrorEmailsPathNotSet = function() {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee);
	this.message = 'Keystone has not been configured for email support. Set the `emails` option in your configuration.';
	this.name = 'ErrorEmailsPathNotSet';
};
util.inherits(ErrorEmailsPathNotSet, Error);

var ErrorEmailOptionsRequired = function() {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee);
	this.message = 'The keystone.Email class requires a templateName or options argument to be provided.';
	this.name = 'ErrorEmailOptionsRequired';
};
util.inherits(ErrorEmailsPathNotSet, Error);

/** Helper methods */

var getEmailsPath = function() {
	var path = keystone.getPath('emails');
	if (path) {
		return path;
	}
	throw new ErrorEmailsPathNotSet();
};

function buildAddress (email, name) {
	if (Array.isArray(email)) {
		return email.map(function (to) { return to.name + ' <' + to.email + '>'; }).join(',');
	} else {
		return name ? name + ' <' + email + '>' : email;
	}
}

/**
 * Flatten an object
 * @param  {Object} obj   Source object
 * @param  {String} delim Delimeter
 * @return {Object}       Flat object
 */
var flattenObject = function(obj, delim) {
	delim = delim || '_';
	var _ret = {};

	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) continue;

		if ((typeof obj[key]) === 'object' && obj[key] !== null) {
			var _flat = flattenObject(obj[key], delim);
			for (var next in _flat) {
				if (!_flat.hasOwnProperty(next)) continue;

				_ret[key + delim + next] = _flat[next];
			}
		} else {
			_ret[key] = obj[key];
		}
	}
	return _ret;
};

/**
 * Converts javascript Objects into
 * Mandrill's vars objects.
 *
 * @param  {Mixed}  _var Object to parse
 * @return {Array}       An array of vars
 */
var objToMandrillVars = function (_var) {
	var _new = [];
	if ('object' === typeof _var) {
		var _flat = flattenObject(_var, '_');
		_.each(_flat, function(value, key) {
			_new.push({ name: key, content: value });
		});
		return _new;
	}
	return _var;
};

/** CSS Helper methods */

var templateCSSMethods = {
	shadeColor: function(color, percent) {
		/* eslint-disable space-infix-ops */
		var num = parseInt(color.slice(1), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
		return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
		/* eslint-enable */
	}
};



/**
 * Email Class
 * ===========
 *
 * Helper class for sending emails with Mandrill.
 *
 * New instances take a `templatePath` string which must be a folder in the
 * emails path, and must contain either `templateName/email.templateExt` or `templateName.templateExt`
 * which is used as the template for the HTML part of the email.
 *
 * Once created, emails can be rendered or sent.
 *
 * Requires the `emails` path option and the `mandrill api key` option to be
 * set on Keystone.
 *
 * @api public
 */

var Email = function(options) {
	// Passing a string will use Email.defaults for everything but template name
	if ('string' === typeof options) {
		options = {
			templateName: options
		};
	} else if (!utils.isObject(options)) {
		throw new ErrorEmailOptionsRequired();
	}

	this.templateMandrillName = options.templateMandrillName;
	this.templateMandrillContent = _.isArray(options.templateMandrillContent) ? options.templateMandrillContent : [];

	this.templateName = options.templateName || this.templateMandrillName;
	this.templateExt = options.templateExt || Email.defaults.templateExt;
	this.templateEngine = options.templateEngine || Email.defaults.templateEngine;
	this.templateBasePath = options.templateBasePath || Email.defaults.templateBasePath;
	this.templateCompile = options.templateCompile || Email.defaults.templateCompile;
	this.templateRender = options.templateRender || Email.defaults.templateRender;

	if (!this.templateName) {
		throw new ErrorNoEmailTemplateName();
	}

	return this;

};

/**
 * Renders the email and passes it to the callback. Used by `email.send()` but
 * can also be called directly to generate a preview.
 *
 * @param {Object} locals - object of local variables provided to the template
 * @param {Function} callback(err, email)
 *
 * @api public
 */

Email.prototype.render = function(locals, callback) {

	if ('function' === typeof locals && !callback) {
		callback = locals;
		locals = {};
	}

	locals = ('object' === typeof locals) ? locals : {};
	callback = ('function' === typeof callback) ? callback : function() {};

	if (keystone.get('email locals')) {
		_.defaults(locals, keystone.get('email locals'));
	}

	_.defaults(locals, {
		pretty: true,
		_: _,
		moment: moment,
		utils: utils,
		subject: '(no subject)',
		brand: keystone.get('brand'),
		theme: {},
		css: templateCSSMethods
	});

	if (!locals.theme.buttons) {
		locals.theme.buttons = {};
	}

	this.compileTemplate(function(err) {
		if (err) {
			return callback(err);
		}

		var html = null;
		var template = templateCache[this.templateName];
		if (this.templateRender) {
			html = this.templateRender(template, locals);
		} else if (typeof template === 'function') {
			html = template(locals);
		} else if (typeof template.render === 'function') {
			html = template.render(locals);
		} else {
			return callback({
				from: 'Email.compileTemplate',
				key: 'invalid rendering function',
				message: 'no template rendering function could be found.',
			});
		}

		// ensure extended characters are replaced
		html = html.replace(/[\u007f-\uffff]/g, function(c) {
			return '&#x' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4) + ';';
		});

		// process email rules
		var rules = keystone.get('email rules');

		if (rules) {

			if (!Array.isArray(rules)) {
				rules = [rules];
			}

			_.each(rules, function(rule) {
				if (rule.find && rule.replace) {

					var find = rule.find,
						replace = rule.replace;

					if ('string' === typeof find) {
						find = new RegExp(find, 'gi');
					}

					html = html.replace(find, replace);
				}
			});

		}

		callback(null, {
			subject: locals.subject,
			html: html
		});

	}.bind(this));

};

/**
 * Loads the template. Looks for `templateName.templateExt`, followed by `templateName/email.templateExt`
 *
 * @param {Function} callback(err)
 *
 * @api private
 */

Email.prototype.loadTemplate = function(callback) {

	callback = ('function' === typeof callback) ? callback : function() {};

	var fsTemplatePath = path.join(Email.getEmailsPath(), this.templateName + '.' + this.templateExt);

	fs.readFile(fsTemplatePath, function(err, contents) {
		if (err) {
			if (err.code === 'ENOENT') {
				fsTemplatePath = path.join(Email.getEmailsPath(), this.templateName, 'email.' + this.templateExt);

				fs.readFile(fsTemplatePath, function(err, contents) {
					callback(err, fsTemplatePath, contents);
				});

			} else {
				return callback(err);
			}
		} else {
			return callback(err, fsTemplatePath, contents);
		}

	}.bind(this));

};

/**
 * Ensures the template for the email has been compiled
 *
 * @param {Function} callback(err)
 *
 * @api private
 */

Email.prototype.compileTemplate = function(callback) {
	callback = ('function' === typeof callback) ? callback : function() {};

	if (keystone.get('env') === 'production' && templateCache[this.templateName]) {
		return process.nextTick(callback);
	}

	this.loadTemplate(function(err, filename, contents) {
		if (err) return callback(err);

		var template = null;
		if (this.templateCompile) {
			template = this.templateCompile(this.templateEngine, contents.toString(), Email.defaults.compilerOptions, fs.realpathSync(filename));
		} else {
			template = this.templateEngine.compile(contents.toString(), Email.defaults.compilerOptions || { filename: fs.realpathSync(filename), basedir: this.templateBasePath }, fs.realpathSync(filename));
		}

		templateCache[this.templateName] = template;

		callback();

	}.bind(this));

};

/**
 * Prepares the email, with or without render
 *
 * @param  {Object}   options  options to render the email
 * @param  {Function} callback(err, message)
 *
 * @api private
 */
Email.prototype.prepare = function(options, callback) {
	var locals = options;

	if (arguments.length === 3 || !utils.isFunction(callback)) {
		callback = arguments[2];
		options = arguments[1] || arguments[0];
	}

	callback = ('function' === typeof callback) ? callback : function() {};

	// Renders an email via Keystone (default behavior)
	if (!this.templateMandrillName || this.templateForceHtml) {

		this.render(locals, function(err, email){

			_.extend(options, email);
			this.buildOptions.call(this, err, options, callback);
		}.bind(this));
	}
	// Uses a Mandrill template directly
	else {
		this.buildOptions.call(this, null, options, callback);
	}
};

/**
 * Build an options object
 *
 * @param  {Object}   options  Input options
 * @param  {Function} callback(err, callback)
 *
 * @api private
 */
Email.prototype.buildOptions = function(err, options, callback) {
	callback = ('function' === typeof callback) ? callback : function() {};

	if (err) {
		return callback(err);
	}

	if (!utils.isObject(options)) {
		return callback({
			from: 'Email.send',
			key: 'invalid options',
			message: 'options object is required'
		});
	}

	if ('string' === typeof options.from) {
		options.fromName = options.from;
		options.fromEmail = options.from;
	} else if (utils.isObject(options.from)) {
		options.fromName = utils.isObject(options.from.name) ? options.from.name.full : options.from.name;
		options.fromEmail = options.from.email;
	}

	if (!options.fromName || !options.fromEmail) {
		return callback({
			from: 'Email.send',
			key: 'invalid options',
			message: 'options.fromName and options.fromEmail are required'
		});
	}
	if (_.isEqual(keystone.get('email transport'), 'mailgun')) {
		if (!options.mailgun) {
			if (!keystone.get('mailgun api key')) {
				return callback({
					from: 'Email.send',
					key: 'missing api key',
					message: 'You must either provide a Mailgun API Instance or set the mandrill api key before sending email.',
				});
			}
			var api_key = keystone.get('mailgun api key');
			var domain = keystone.get('mailgun domain');
			options.mailgun = new mailgunapi({ apiKey: api_key, domain: domain });
		}
	} else {
		if (!options.mandrill) {
			if (!keystone.get('mandrill api key')) {
				return callback({
					from: 'Email.send',
					key: 'missing api key',
					message: 'You must either provide a Mandrill API Instance or set the mandrill api key before sending email.',
				});
			}
			options.mandrill = new mandrillapi.Mandrill(keystone.get('mandrill api key'));
		}
	}

	options.tags = utils.isArray(options.tags) ? options.tags : [];
	options.tags.push('sent:' + moment().format('YYYY-MM-DD'));
	options.tags.push(this.templateName);

	if (keystone.get('env') === 'development') {
		options.tags.push('development');
	}

	/**
	 * Convert and concat globalMergeVars
	 */
	if (options.globalMergeVars) {
		options.global_merge_vars = (options.global_merge_vars || []).concat(objToMandrillVars(options.globalMergeVars));
	}

	var recipients = [];
	var mergeVars = [];

	options.to = Array.isArray(options.to) ? options.to : [options.to];

	for (var i = 0; i < options.to.length; i++) {
		if (typeof options.to[i] === 'string') {
			options.to[i] = { email: options.to[i] };
		} else if (typeof options.to[i] === 'object' && options.to[i] !== null) {
			if (!options.to[i].email) {
				return callback({
					from: 'Email.send',
					key: 'invalid recipient',
					message: 'Recipient ' + (i + 1) + ' does not have a valid email address.',
				});
			}

		} else {
			return callback({
				from: 'Email.send',
				key: 'invalid recipient',
				message: 'Recipient ' + (i + 1) + ' is not a string or an object.',
			});

		}

		var recipient = { email: options.to[i].email };
		var vars = [{ name: 'email', content: recipient.email }];

		if (typeof options.to[i].name === 'string') {
			recipient.name = options.to[i].name;
			vars.push({ name: 'name', content: options.to[i].name });
		} else if (typeof options.to[i].name === 'object') {
			recipient.name = options.to[i].name.full || '';
			vars.push({ name: 'name', content: options.to[i].name.full || '' });
			vars.push({ name: 'first_name', content: options.to[i].name.first || '' });
			vars.push({ name: 'last_name', content: options.to[i].name.last || '' });
		}

		// Mandrill template
		if (recipient.vars) {
			vars.concat(objToMandrillVars(recipient.vars));
		}

		recipients.push(recipient);

		mergeVars.push({
			rcpt: recipient.email,
			vars: vars,
		});
	}

	var message = {
		headers: options.headers,
		from_name: options.fromName,
		from_email: options.fromEmail,
		tags: options.tags,
		attachments: options.attachments,
		to: recipients,
		global_merge_vars: options.global_merge_vars,
		merge_vars: mergeVars,
		async: true,
	};

	if (options.subject) {
		message.subject = options.subject;
	}

	if (options.html) {
		message.html = options.html;
	}

	_.defaults(message, options.mandrillOptions);
	_.defaults(message, Email.defaults.mandrill);

	var toSend = {
		message: message,
	};

	if (this.templateMandrillName) {
		toSend.template_name = this.templateMandrillName;
		toSend.template_content = this.templateMandrillContent;
		if (_.isArray(options.templateMandrillContent)) {
			toSend.template_content = toSend.template_content.concat(options.templateMandrillContent);
		}
	}

	callback(null, toSend);
};

/**
 * Sends the email
 *
 * Options:
 *
 * - mandrill
 *   Initialised Mandrill API instance
 *
 * - tags
 *   Array of tags to send to Mandrill
 *
 * - to
 *   Object / String or Array of Objects / Strings to send to, e.g.
 *   ['jed@team9.com.au', { email: 'jed.watson@gmail.com' }]
 *   { email: 'jed@team9.com.au' }
 *   'jed@team9.com.au'
 *
 * - fromName
 *   Name to send from
 *
 * - fromEmail
 *   Email address to send from
 *
 * - headers
 *   Headers to send through with the email
 *
 * For compatibility with older implementations, send supports providing
 * locals and options objects as the first and second arguments, and the
 * callback as the third.
 *
 * @param {Object} options (passed to `email.render()`)
 * @param {Function} callback(err, info)
 *
 * @api private
 */

Email.prototype.send = function (options, callback) {
	var locals = options;
	var prepareOptions = [locals];

	if (arguments.length === 3) {
		// we expect locals, options, callback
		if (_.isObject(arguments[1])) {
			prepareOptions.push(arguments[1]);
		}
		callback = arguments[2];

	} else if (arguments.length === 2 && !utils.isFunction(callback)) {
		// no callback so we expect locals, options
		if (_.isObject(arguments[1])) {
			prepareOptions.push(arguments[1]);
		}
		callback = function(err, info) {// eslint-disable-line no-unused-vars
			if (err) console.log(err);
		};

	} else if (arguments.length === 1) {
		// we expect options here and it is pushed already
		callback = function (err, info) { // eslint-disable-line no-unused-vars
			if (err) console.log(err);
		};
	}

	prepareOptions.push(function (err, toSend) {
		if (err) {
			return callback(err, null);
		}

		var onSuccess = function (info) {
			callback(null, info);
		};

		var onFail = function (info) {
			callback({
				from: 'Email.send',
				key: 'send error',
				message: 'Email transport encountered an error and did not send the emails.',
				info: info,
			});
		};
		if (_.isEqual(keystone.get('email transport'), 'mailgun')) {
			var msg = toSend.message;
			var data = {
				from: buildAddress(msg.from_email, msg.from_name),
				to: buildAddress(msg.to),
				subject: msg.subject,
				html: juice(msg.html),
				attachment: msg.attachments,
			};
			return process.nextTick(function () {
				options.mailgun.messages().send(data, function (err, body) {
					if (err) return onFail(err);
					onSuccess(body);
				});
			});
		} else {
			if (this.templateMandrillName) {
				return process.nextTick(function () {
					options.mandrill.messages.sendTemplate(toSend, onSuccess, onFail);
				});
			} else {
				return process.nextTick(function () {
					options.mandrill.messages.send(toSend, onSuccess, onFail);
				});
			}
		}
	}.bind(this));

	this.prepare.apply(this, prepareOptions);
};

/**
 * Renders a Mandrill template
 * @param  {Object}   options  Same options that sendTemplate
 * @param  {Function} callback(err, info)
 */
Email.prototype.renderMandrill = function (options, callback) {
	var locals = options;
	var prepareOptions = [locals];

	if (arguments.length === 3 || !utils.isFunction(callback)) {
		callback = arguments[2];
		options = arguments[1] || arguments[0];
		prepareOptions.push(options);
	}

	callback = ('function' === typeof callback) ? callback : function() {};

	prepareOptions.push(function (err, toSend) {
		if (err) {
			return callback(err, null);
		}

		/**
		 * The object sent to render is not the same as for the sendTemplate
		 * method, so it needs to be changed accordingly.
		 *
		 * https://mandrillapp.com/api/docs/templates.JSON.html#method=render
		 * https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template
		 */

		if (toSend.message.merge_vars && toSend.message.merge_vars.length) {
			toSend.merge_vars = toSend.message.merge_vars[0].vars;
		}

		if (toSend.message.global_merge_vars) {
			toSend.global_merge_vars = toSend.message.global_merge_vars;
		}

		var onSuccess = function (info) {
			callback(null, info);
		};

		var onFail = function (info) {
			callback({
				from: 'Email.renderMandrill',
				key: 'render error',
				message: 'Mandrill encountered an error rendering the email.',
				info: info,
			});
		};

		options.mandrill.templates.render(toSend, onSuccess, onFail);
	});

	this.prepare.apply(this, prepareOptions);
};

Email.getEmailsPath = getEmailsPath;
Email.templateCache = templateCache;
Email.templateCSSMethods = templateCSSMethods;
Email.defaults = defaultConfig;

exports = module.exports = Email;
