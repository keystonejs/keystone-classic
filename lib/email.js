var _ = require('lodash');
var fs = require('fs');
var keystone = require('../');
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
if (keystone.get('email transport') !== 'mailgun') {
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
// I've marked these to be ignored by eslint but we should find a better way.

var ErrorNoEmailTemplateName = function () {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // eslint-disable-line no-caller
	this.message = 'No email templateName specified.';
	this.name = 'ErrorNoEmailTemplateName';
};
util.inherits(ErrorNoEmailTemplateName, Error);

var ErrorEmailsPathNotSet = function () {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // eslint-disable-line no-caller
	this.message = 'Keystone has not been configured for email support. Set the `emails` option in your configuration.';
	this.name = 'ErrorEmailsPathNotSet';
};
util.inherits(ErrorEmailsPathNotSet, Error);

var ErrorEmailOptionsRequired = function () {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // eslint-disable-line no-caller
	this.message = 'The keystone.Email class requires a templateName or options argument to be provided.';
	this.name = 'ErrorEmailOptionsRequired';
};
util.inherits(ErrorEmailsPathNotSet, Error);

var ErrorKeystoneEmailNotInstalled = function () {
	Error.apply(this, arguments);
	Error.captureStackTrace(this, arguments.callee); // eslint-disable-line no-caller
	this.message = 'The "keystone-email" package needs to be installed to send emails.';
	this.name = 'ErrorKeystoneEmailNotInstalled';
};
util.inherits(ErrorKeystoneEmailNotInstalled, Error);


/**
 * Flatten an object
 * @param  {Object} obj   Source object
 * @param  {String} delim Delimeter
 * @return {Object}       Flat object
 */
var flattenObject = function (obj, delim) {
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
	if (typeof _var === 'object') {
		var _flat = flattenObject(_var, '_');
		_.forEach(_flat, function (value, key) {
			_new.push({ name: key, content: value });
		});
		return _new;
	}
	return _var;
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

var Email = function (options) {
	// Passing a string will use Email.defaults for everything but template name
	if (typeof options === 'string') {
		options = {
			templateName: options,
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

	var EmailInstance;

	try {
		EmailInstance = require('keystone-email');
	} catch (err) {
		throw new ErrorKeystoneEmailNotInstalled();
	}

	return new EmailInstance(this.templateName, {
		engine: this.templateEngine,
		transport: keystone.get('email transport'),
	});
};

/**
 * Loads the template. Looks for `templateName.templateExt`, followed by `templateName/email.templateExt`
 *
 * @param {Function} callback(err)
 *
 * @api private
 */

Email.prototype.loadTemplate = function (callback) {
	callback = (typeof callback === 'function') ? callback : function () {};

	var fsTemplatePath = path.join(Email.getEmailsPath(), this.templateName + '.' + this.templateExt);

	fs.readFile(fsTemplatePath, function (err, contents) {
		if (err) {
			if (err.code === 'ENOENT') {
				fsTemplatePath = path.join(Email.getEmailsPath(), this.templateName, 'email.' + this.templateExt);

				fs.readFile(fsTemplatePath, function (err, contents) {
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

Email.prototype.compileTemplate = function (callback) {
	callback = (typeof callback === 'function') ? callback : function () {};

	if (keystone.get('env') === 'production' && templateCache[this.templateName]) {
		return process.nextTick(callback);
	}

	this.loadTemplate(function (err, filename, contents) {
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
Email.prototype.prepare = function (options, callback) {
	var locals = options;

	if (arguments.length === 3 || !utils.isFunction(callback)) {
		callback = arguments[2];
		options = arguments[1] || arguments[0];
	}

	callback = (typeof callback === 'function') ? callback : function () {};

	// Renders an email via Keystone (default behavior)
	if (!this.templateMandrillName || this.templateForceHtml) {
		this.render(locals, function (err, email) {
			_.extend(options, email);
			this.buildOptions(err, options, callback);
		}.bind(this));
	}
	// Uses a Mandrill template directly
	else {
		this.buildOptions(null, options, callback);
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
Email.prototype.buildOptions = function (err, options, callback) {
	callback = (typeof callback === 'function') ? callback : function () {};

	if (err) {
		return callback(err);
	}

	if (!utils.isObject(options)) {
		return callback({
			from: 'Email.send',
			key: 'invalid options',
			message: 'options object is required',
		});
	}

	if (typeof options.from === 'string') {
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
			message: 'options.fromName and options.fromEmail are required',
		});
	}
	if (keystone.get('email transport') === 'mailgun') {
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
			// defer loading mailgun-js until it is going to be used
			var mailgunapi = require('mailgun-js');
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
			// defer loading mandrill-api until it is going to be used
			var mandrillapi = require('mandrill-api');
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

module.exports = Email;
