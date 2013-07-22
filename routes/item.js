var prospekt = require('../'),
	_ = require('underscore'),
	cloudinary = require('cloudinary'),
	moment = require('moment'),
	utils = require('../lib/utils');

exports = module.exports = function(req, res) {
	
	req.list.model.findById(req.params.item).exec(function(err, item) {
		
		if (Array.isArray(item))
			item = item[0]; // WTF??? I thought findById was only meant to return a single document.
		
		if (!item) {
			req.flash('error', 'Item ' + req.params.item + ' could not be found.');
			return res.redirect('/prospekt/' + req.list.path);
		}
		
		var viewLocals = {
			validationErrors: {}
		};
		
		var renderView = function() {
			
			prospekt.render(req, res, 'item', _.extend(viewLocals, {
				section: req.list.key,
				list: req.list,
				item: item
			}));
			
		}
		
		if (req.method == 'POST' && req.body.action == 'updateItem' && !req.list.get('noedit')) {
			
			var actionQueue = [],
				validationErrors = [];
			
			var progress = function() {
				if (validationErrors.length) {
					_.each(validationErrors, function(i) { req.flash('error', i); });
					renderView();
				} else if (actionQueue.length) {
					// TODO: async upload to cloudinary
					actionQueue.pop()();
				} else {
					saveItem();
				}
			}
			
			var saveItem = function() {
				item.save(function(err) {
					if (err) {
						if (err.name == 'ValidationError') {
							viewLocals.validationErrors = err.errors;
							_.each(err.errors, function(e, path) {
								if (e.type == 'required') {
									req.flash('error', 'Field ' + path + ' is required.');
								}
							});
						} else {
							console.error('Error saving changes to ' + req.list.singular + ' ' + item.id + ':');
							console.error(err);
							req.flash('error', 'There was an error saving your changes. Please check the console.');
						}
						return renderView();
					} else {
						req.flash('success', 'Your changes have been saved.');
						return res.redirect('/prospekt/' + req.list.path + '/' + item.id);
					}
				});
			}
			
			if (req.list.nameIsEditable) {
				if (req.list.nameField.validateInput(req.body))
					req.list.nameField.updateItem(item, req.body);
				else
					validationErrors.push(list.singular + ' name is required.');
			}
			
			_.each(req.list.formFields, function(field) {
				
				// skip uneditable fields
				if (field.noedit)
					return;
				
				// Some field types have custom behaviours
				switch (field.type) {
					
					case 'image':
						actionQueue.push(field.getRequestHandler(item, req, function(err) {
							if (err)
								req.flash('error', field.label + ' upload failed - ' + err.message);
							progress();
						}));
					break;
					
					case 'password':
						// passwords should only be set if a value is provided
						if (!req.body[field.path])
							return;
						// validate matching password fields
						if (req.body[field.path] != req.body[field.paths.confirm])
							validationErrors.push('Passwords must match.');
					break;
					
					case 'email':
						if (req.body[field.path] && !utils.isEmail(req.body[field.path]))
							validationErrors.push('Please enter a valid email address in the ' + field.label + ' field.');
					break;
				}
				
				// validate required fields.
				if (field.required && !field.validateInput(req.body))
					validationErrors.push(field.label + ' is required.');
				
				field.updateItem(item, req.body);
				
				/*
				switch (field.fieldType) {
					case 'image':
						var oldImage = item.get(field.path);
						if (_.has(req.body, field.path + '_action') && oldImage.public_id) {
							switch (req.body[field.path + '_action']) {
								case 'delete':
									actionQueue.push(function() {
										cloudinary.uploader.destroy(oldImage.public_id, function() { progress(); });
									});
								case 'clear':
									item.set(field.path, image.blank());
							}
						}
						if (req.files && req.files[field.path + '_upload'] && req.files[field.path + '_upload'].size) {
							var tp = prospekt.get('cloudinaryTagPrefix') || '';
							if (tp.length)
								tp += '_';
							var uploadOptions = {
								tags: [tp + req.list.path + '_' + field.path, tp + req.list.path + '_' + field.path + '_' + item.id]
							}
							if (prospekt.get('cloudinaryTagPrefix'))
								uploadOptions.tags.push(prospekt.get('cloudinaryTagPrefix'));
							if (prospekt.get('env') != 'production')
								uploadOptions.tags.push(tp + 'dev');
							actionQueue.push(function() {
								cloudinary.uploader.upload(req.files[field.path + '_upload'].path, function(result) {
									if (result.error) {
										req.flash('error', 'Image upload failed - ' + result.error.message);
									} else {
										item.set(field.path, result);
									}
									progress();
								}, uploadOptions);
							});
						}
					break;
					case 'location':
						if (_.has(req.body, field.path)) {
							var ol = item.get(field.path);
							var nl = req.body[field.path];
							var lc = false;
							if (!Array.isArray(nl.geo) || nl.geo.length != 2 || !Number(nl.geo[0]) || !Number(nl.geo[1])) {
								delete nl.geo;
							}
							if (nl.geo && (ol.geo[0] != nl.geo[0] || ol.geo[1] != nl.geo[1])) {
								lc = true;
								// console.log('geo changed');
								// console.log((ol.geo && !nl.geo) || (!ol.geo && nl.geo));
							}
							for (var i in ol) {
								if (i != 'geo' && ol[i] != nl[i]) {
									lc = true;
									// console.log('location.' + i + ' changed');
									break;
								}
							}
							if (lc)
								item.set(field.path, req.body[field.path]);
							// console.log('Location changed: ' + lc);
							if (_.has(req.body, field.path + '_improve')) {
								actionQueue.push(function() {
									item['googleGeocode_' + field.path](progress, false);
								});
							}
						}
				}
				*/
			});
			
			progress();
			
		} else {
			renderView();
		}
		
	});
	
}