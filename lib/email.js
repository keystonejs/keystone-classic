var _ = require('underscore'),
	keystone = require('../'),
	fs = require('fs'),
	util = require('util'),
	path = require('path'),
	moment = require('moment'),
	utils = require('keystone-utils'),
	mandrillapi = require('mandrill-api');

var templateCache = {};

var defaultConfig = {
	templateExt: 'jade',
	templateEngine: require('jade'),
	templateBasePath: path.normalize(path.join(__dirname, '..', 'templates', 'helpers', 'emails')),
	mandrill: {
		track_opens: true,
		track_clicks: true,
		preserve_recipients: false,
		inline_css: true
	}
};


/** Custom Errors */

// TOTO: Uses arguments.callee for the stack trace, which prevents optimisation.
// I've marked these to be ignored by jshint but we should find a better way.

var ErrorNoEmailTemplateName = function() {
 	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // jshint ignore:line
	this.message = 'No email templateName specified.';
	this.name = 'ErrorNoEmailTemplateName';
};
util.inherits(ErrorNoEmailTemplateName, Error);

var ErrorEmailsPathNotSet = function() {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // jshint ignore:line
	this.message = 'Keystone has not been configured for email support. Set the `emails` option in your configuration.';
	this.name = 'ErrorEmailsPathNotSet';
};
util.inherits(ErrorEmailsPathNotSet, Error);

var ErrorEmailOptionsRequired = function() {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // jshint ignore:line
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

/** CSS Helper methods */

var templateCSSMethods = {
	shadeColor: function(color, percent) {
		/* jshint ignore:start */
		var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
		return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
		/* jshint ignore:end */
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
	if ('string' === typeof(options)) {
		options = {
			templateName: options
		};
	} else if (!utils.isObject(options)) {
		throw new ErrorEmailOptionsRequired();
	}

	this.templateName = options.templateName;
	this.templateExt = options.templateExt || Email.defaults.templateExt;
	this.templateEngine = options.templateEngine || Email.defaults.templateEngine;
	this.templateBasePath = options.templateBasePath || Email.defaults.templateBasePath;

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

		var html = templateCache[this.templateName](locals);

		// ensure extended characters are replaced
		html = html.replace(/[\u007f-\uffff]/g, function(c) {
			return '&#x'+('0000'+c.charCodeAt(0).toString(16)).slice(-4)+';';
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

	if (keystone.get('env') === 'production' && templateCache[this.templateName]) {
		return process.nextTick(callback);
	}

	this.loadTemplate(function(err, filename, contents) {

		if (err) return callback(err);

		var template = this.templateEngine.compile(contents.toString(), Email.defaults.compilerOptions || { filename: fs.realpathSync(filename), basedir: this.templateBasePath });

		templateCache[this.templateName] = template;

		callback();

	}.bind(this));

};

/**
 * Prepares the email and sends it
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
 * For compatibility with older implementations, send supports providing
 * locals and options objects as the first and second arguments, and the
 * callback as the third.
 *
 * @param {Object} options (passed to `email.render()`)
 * @param {Function} callback(err, info)
 *
 * @api private
 */

Email.prototype.send = function(options, callback) {

	var locals = options;

	if (arguments.length === 3 || !utils.isFunction(callback)) {
		callback = arguments[2];
		options = arguments[1] || arguments[0];
	}

	this.render(locals, function(err, email) {

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

		if (!options.mandrill) {
			if (!keystone.get('mandrill api key'))
				return callback({
					from: 'Email.send',
					key: 'missing api key',
					message: 'You must either provide a Mandrill API Instance or set the mandrill api key before sending email.'
				});
			options.mandrill = new mandrillapi.Mandrill(keystone.get('mandrill api key'));
		}

		options.tags = utils.isArray(options.tags) ? options.tags : [];
		options.tags.push('sent:' + moment().format('YYYY-MM-DD'));
		options.tags.push(this.templateName);

		if (keystone.get('env') === 'development') {
			options.tags.push('development');
		}

		var recipients = [],
			mergeVars = [];

		options.to = Array.isArray(options.to) ? options.to : [options.to];

		for (var i = 0; i < options.to.length; i++) {

			if ('string' === typeof options.to[i]) {
				options.to[i] = { email: options.to[i] };
			} else if ('object' === typeof options.to[i]) {
				if (!options.to[i].email) {
					return callback({
						from: 'Email.send',
						key: 'invalid recipient',
						message: 'Recipient ' + (i + 1) + ' does not have a valid email address.'
					});
				}
			} else {
				return callback({
					from: 'Email.send',
					key: 'invalid recipient',
					message: 'Recipient ' + (i + 1) + ' is not a string or an object.'
				});
			}

			var recipient = { email: options.to[i].email },
				vars = [{ name: 'email', content: recipient.email }];

			if ('string' === typeof options.to[i].name) {
				recipient.name = options.to[i].name;
				vars.push({ name: 'name', content: options.to[i].name });
			} else if ('object' === typeof options.to[i].name) {
				recipient.name = options.to[i].name.full || '';
				vars.push({ name: 'name', content: options.to[i].name.full || '' });
				vars.push({ name: 'first_name', content: options.to[i].name.first || '' });
				vars.push({ name: 'last_name', content: options.to[i].name.last || '' });
			}

			recipients.push(recipient);

			mergeVars.push({
				rcpt: recipient.email,
				vars: vars
			});
		}

		var onSuccess = function(info) {
			callback(null, info);
		};

		var onFail = function(info) {
			callback({
				from: 'Email.send',
				key: 'send error',
				message: 'Mandrill encountered an error and did not send the emails.',
				info: info
			});
		};

		var message = {
			html: email.html,
			subject: email.subject,
			from_name: options.fromName,
			from_email: options.fromEmail,
			tags: options.tags,
			attachments: options.attachments,
			to: recipients,
			merge_vars: mergeVars,
			async: true
		};

		_.defaults(message, options.mandrillOptions);
		_.defaults(message, Email.defaults.mandrill);

		return process.nextTick(function() {
			options.mandrill.messages.send({ message: message }, onSuccess, onFail);
		});

	}.bind(this));

};

Email.getEmailsPath = getEmailsPath;
Email.templateCache = templateCache;
Email.templateCSSMethods = templateCSSMethods;
Email.defaults = defaultConfig;

exports = module.exports = Email;
