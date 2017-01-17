var keystone = require('../index');
var utils = require('keystone-utils');

/**
 * Email Class
 * ===========
 *
 * Helper class for sending emails with Mandrill.
 *
 * New instances take a `templatePath` string which must be a folder in the
 * emails path, and must contain either `templateName/email.templateExt` or
 * `templateName.templateExt` which is used as the template for the HTML part
 * of the email.
 *
 * Once created, emails can be rendered or sent.
 *
 * Requires the `emails` path option and the `mandrill api key` option to be
 * set on Keystone.
 *
 * @api public
 */

var Email = function (options) {
	if (typeof options === 'string') {
		options = { templateName: options };
	}
	if (!utils.isObject(options)) {
		throw new Error('The keystone.Email class requires a templateName or options argument to be provided');
	}

	/**
	 * Keystone < 0.4 Compatibility
	 *
	 * NOTE: Add warnings and enable them in 4.1 or 4.2 release. These patterns
	 * will be deprecated with the 0.5 release!
	 */
	// keystome.set('email transport', 'sometransport') -> options.transport
	var emailTransport = keystone.get('email transport');
	if (!options.transport && emailTransport) {
		options.transport = emailTransport;
	}
	// mandrill used to be the default; provide it if the api key is set
	var mandrillApiKey = keystone.get('mandrill api key');
	if (!options.transport && mandrillApiKey) {
		options.transport = 'mandrill';
		options.apiKey = mandrillApiKey;
	}
	// templateExt -> engine
	if (!options.engine) {
		options.engine = options.templateExt;
	}
	// keystone.set('view engine', 'something') -> engine
	if (!options.engine) {
		var customEngine = keystone.get('custom engine');
		var viewEngine = keystone.get('view engine');
		if (typeof customEngine === 'function') {
			// when customEngine is a function, viewEngine is probably the extension
			options.engine = customEngine;
			options.ext = options.ext || options.templateExt || viewEngine;
		} else if (viewEngine) {
			// otherwise, default the email engine to keystone's view engine
			options.engine = viewEngine;
		}
	}
	// keystone.set('emails', 'rootpath') -> root
	var rootPath = keystone.get('emails');
	if (rootPath && !options.root) {
		options.root = rootPath;
	}

	// Try to use the keystone-email package and throw if it hasn't been installed
	var KeystoneEmail;
	try {
		KeystoneEmail = require('keystone-email');
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			throw new Error('The "keystone-email" package needs to be installed to send emails');
		} else {
			throw err;
		}
	}

	// Create the new email instance with the template name and options
	var templateName = options.templateName;
	delete options.templateName;
	var email = new KeystoneEmail(templateName, options);

	// Make email.send backwards compatible with old argument signature
	var send = email.send;
	email.send = function () {
		var args = [arguments[0]];
		if (typeof arguments[1] === 'function') {
			// map .send(options, callback) => .send(locals, options, callback)
			// TOOD: Deprecate this call signature
			args.push(arguments[0]);
			args.push(arguments[1]);
		} else {
			// map .send(locals options, callback) => .send(locals, options, callback)
			args.push(arguments[1]);
			args.push(arguments[2]);
		}
		send.apply(email, args);
	};

	return email;
};

module.exports = Email;
