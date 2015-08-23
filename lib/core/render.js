var _ = require('underscore');
var cloudinary = require('cloudinary');
var debug = require('debug')('keystone:core:render');
var fs = require('fs');
var jade = require('jade');
var moment = require('moment');
var numeral = require('numeral');
var utils = require('keystone-utils');

/**
 * Renders a Keystone View
 *
 * @api private
 */

var templateCache = {};

function render(req, res, view, ext) {

	var keystone = this;

	var templatePath = __dirname + '/../../templates/views/' + view + '.jade';

	debug('rendering ' + templatePath);

	var jadeOptions = {
		filename: templatePath,
		pretty: keystone.get('env') !== 'production'
	};

	// TODO: Allow custom basePath for extensions... like this or similar
	// if (keystone.get('extensions')) {
	// 	jadeOptions.basedir = keystone.getPath('extensions') + '/templates';
	// }

	var compileTemplate = function() {
		debug('compiling');
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), jadeOptions);
	};

	var template = keystone.get('viewCache')
		? templateCache[view] || (templateCache[view] = compileTemplate())
		: compileTemplate();

	if (!res.req.flash) {
		console.error('\nKeystoneJS Runtime Error:\n\napp must have flash middleware installed. Try adding "connect-flash" to your express instance.\n');
		process.exit(1);
	}
	var flashMessages = {
		info: res.req.flash('info'),
		success: res.req.flash('success'),
		warning: res.req.flash('warning'),
		error: res.req.flash('error'),
		hilight: res.req.flash('hilight')
	};

	var locals = {
		_: _,
		moment: moment,
		numeral: numeral,
		env: keystone.get('env'),
		brand: keystone.get('brand'),
		appversion : keystone.get('appversion'),
		nav: keystone.nav,
		messages: _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false,
		lists: keystone.lists,
		js: 'javascript:;',// eslint-disable-line no-script-url
		utils: utils,
		User: keystone.lists[keystone.get('user model')],
		user: req.user,
		title: 'Keystone',
		signout: keystone.get('signout url'),
		backUrl: keystone.get('back url') || '/',
		section: {},
		version: keystone.version,
		csrf_header_key: keystone.security.csrf.CSRF_HEADER_KEY,
		csrf_token_key: keystone.security.csrf.TOKEN_KEY,
		csrf_token_value: keystone.security.csrf.getToken(req, res),
		csrf_query: '&' + keystone.security.csrf.TOKEN_KEY + '=' + keystone.security.csrf.getToken(req, res),
		ga: {
			property: keystone.get('ga property'),
			domain: keystone.get('ga domain')
		},
		wysiwygOptions: {
			enableImages: keystone.get('wysiwyg images') ? true : false,
			enableCloudinaryUploads: keystone.get('wysiwyg cloudinary images') ? true : false,
			additionalButtons: keystone.get('wysiwyg additional buttons') || '',
			additionalPlugins: keystone.get('wysiwyg additional plugins') || '',
			additionalOptions: keystone.get('wysiwyg additional options') || {},
			overrideToolbar: keystone.get('wysiwyg override toolbar'),
			skin: keystone.get('wysiwyg skin') || 'keystone',
			menubar: keystone.get('wysiwyg menubar'),
			importcss: keystone.get('wysiwyg importcss') || ''
		}
	};

	// optional extensions to the local scope
	_.extend(locals, ext);

	// add cloudinary locals if configured
	if (keystone.get('cloudinary config')) {
		try {
			debug('adding cloudinary locals');
			var cloudinaryUpload = cloudinary.uploader.direct_upload();
			locals.cloudinary = {
				cloud_name: keystone.get('cloudinary config').cloud_name,
				api_key: keystone.get('cloudinary config').api_key,
				timestamp: cloudinaryUpload.hidden_fields.timestamp,
				signature: cloudinaryUpload.hidden_fields.signature,
				prefix: keystone.get('cloudinary prefix') || '',
				folders: keystone.get('cloudinary folders'),
				uploader: cloudinary.uploader
			};
			locals.cloudinary_js_config = cloudinary.cloudinary_js_config();
		} catch(e) {
			if (e === 'Must supply api_key') {
				throw new Error('Invalid Cloudinary Config Provided\n\n' +
					'See http://keystonejs.com/docs/configuration/#services-cloudinary for more information.');
			} else {
				throw e;
			}
		}
	}

	// fieldLocals defines locals that are provided to each field's `render` method
	locals.fieldLocals = _.pick(locals, '_', 'moment', 'numeral', 'env', 'js', 'utils', 'user', 'cloudinary');

	var html = template(_.extend(locals, ext));

	debug('sending down html');
	res.send(html);
}

module.exports = render;
