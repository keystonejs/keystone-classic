var keystone = require('../index');
var utils = require('keystone-utils');

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
	if (typeof options === 'string') {
		options = { templateName: options };
	}
	if (!utils.isObject(options)) {
		throw new Error('The keystone.Email class requires a templateName or options argument to be provided');
	}
	/**
	 * Keystone@<0.4 Compatibility
	 *
	 * NOTE: Add warnings and enable them in 4.1 or 4.2 release. These patterns will be deprecated
	 * with the 0.5 release!
	 */
	// keystome.set('email transport', 'sometransport') -> options.transport
	var emailTransport = keystone.get('email transport');
	if (!options.transport && emailTransport) {
		options.transport = emailTransport;
	}
	// templateExt -> engine
	if (!options.engine) {
		options.engine = options.templateExt;
	}
	// keystone.set('emails', 'rootpath') -> root
	var rootPath = keystone.get('emails');
	if (rootPath && !options.root) {
		options.root = rootPath;
	}


	var EmailInstance;
	var templateName = options.templateName;
	delete options.templateName;

	try {
		EmailInstance = require('keystone-email');
	} catch (err) {
		if (err.code === 'MODULE_NOT_FOUND') {
			throw new Error('The "keystone-email" package needs to be installed to send emails');
		} else {
			throw err;
		}
	}

	return new EmailInstance(templateName, options);
};

module.exports = Email;
