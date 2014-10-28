var _ = require('underscore'),
	fs = require('fs'),
	jade = require('jade'),
	cloudinary = require('cloudinary'),
	moment = require('moment'),
	numeral = require('numeral'),
	utils = require('keystone-utils');

/**
 * Renders a Keystone View
 *
 * @api private
 */

function render(req, res, view, ext) {
	
	var keystone = this;
		
	var templatePath = __dirname + '/../../templates/views/' + view + '.jade';
	
	var jadeOptions = {
		filename: templatePath,
		pretty: keystone.get('env') !== 'production'
	};
	
	// TODO: Allow custom basePath for extensions... like this or similar
	// if (keystone.get('extensions')) {
	// 	jadeOptions.basedir = keystone.getPath('extensions') + '/templates';
	// }
	
	var compileTemplate = function() {
		return jade.compile(fs.readFileSync(templatePath, 'utf8'), jadeOptions);
	};
	
	var template = keystone.get('viewCache')
		? templateCache[view] || (templateCache[view] = compileTemplate())
		: compileTemplate();
		
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
		nav: keystone.nav,
		messages: _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false,
		lists: keystone.lists,
		js: 'javascript:;',
		utils: utils,
		User: keystone.list(keystone.get('user model')),
		user: req.user,
		title: 'Keystone',
		signout: keystone.get('signout url'),
		backUrl: keystone.get('back url') || '/',
		section: {},
		version: keystone.version,
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
			menubar: keystone.get('wysiwyg menubar')
		}
	};
	
	// optional extensions to the local scope
	_.extend(locals, ext);
	
	// add cloudinary locals if configured
	if (keystone.get('cloudinary config')) {
		try {
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
	
	res.send(html);
};

module.exports = render;
