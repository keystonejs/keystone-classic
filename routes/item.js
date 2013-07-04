var prospekt = require('../'),
	_ = require('underscore'),
	cloudinary = require('cloudinary'),
	moment = require('moment'),
	image = require('../lib/image');

exports = module.exports = function(req, res) {
	
	// req._tick("Finding Item");
	
	req.list.model.findById(req.params.item).exec(function(err, item) {
		
		if (Array.isArray(item))
			item = item[0]; // WTF??? I thought findById was only meant to return a single document.
		
		if (!item) {
			req.flash('error', 'Item ' + req.params.item + ' could not be found.');
			return res.redirect('/prospekt/' + req.list.path);
		}
		
		// req._tick("Found Item");
		
		var renderView = function() {
			
			var ready = function() {
				prospekt.render(req, res, 'item', {
					section: req.list.key,
					list: req.list,
					item: item
				});
			}
			
			/* not needed (yet...)
			var populate = [];
			
			_.each(req.list.fields, function(field) {
				if (field.fieldType == 'objects')
					populate.push(field.path);
			});
			
			if (populate.length) {
				item.populate(populate.join(' '), ready);
			} else {
				ready();
			}
			*/
			
			ready();
			
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
						console.error('Error saving changes to ' + req.list.singular + ' ' + item.id + ':');
						console.error(err);
						req.flash('error', 'There was an error saving your changes. Please check the console.');
						return renderView();
					}
					req.flash('success', 'Your changes have been saved.');
					return res.redirect('/prospekt/' + req.list.path + '/' + item.id);
				});
			}
			
			_.each(req.list.fields, function(field) {
				
				if (field.noedit)
					return;
				
				switch (field.fieldType) {
					case 'checkbox':
						if (_.has(req.body, field.path) && req.body[field.path] == 'true' && !item.get(field.path))
							item.set(field.path, true);
						else if (item.get(field.path) && req.body[field.path] != 'true')
							item.set(field.path, false);
					break;
					case 'object':
						if (_.has(req.body, field.path) && item.get(field.path) != req.body[field.path]/* && ObjectId.isValid(req.body[field.path])*/) // TODO: Try and make sure it's a valid ObjectId...
							item.set(field.path, req.body[field.path] || undefined);
					break;
					case 'objects':
						if (_.has(req.body, field.path)) {
							var _old = item.get(field.path).map(function(i) { return String(i) }),
								_new = _.compact(req.body[field.path].split(','));
							// console.log("field " + field.path + ' was:');
							// console.log(_old);
							// console.log('... now:');
							// console.log(_new);
							if (_.difference(_old, _new).length || _.difference(_new, _old).length) {
								item.set(field.path, _new);
							}
						}
					break;
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
					case 'date':
					case 'datetime':
						if (_.has(req.body, field.path)) {
							var newValue = moment(req.body[field.path]);
							if (!newValue.isSame(item.get(field.path)))
								item.set(field.path, newValue.toDate());
						}
					break;
					case 'password':
						if (req.body[field.path]) {
							// validate matching passwords
							if (req.body[field.path] == req.body[field.path + '_confirm']) {
								item.set(field.path, req.body[field.path]);
							} else {
								validationErrors.push('Passwords must match.');
							}	
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
					default:
						if (_.has(req.body, field.path) && item.get(field.path) != req.body[field.path])
							item.set(field.path, req.body[field.path]);
				}
				
			});
			
			progress();
			
		} else {
			renderView();
		}
		
	});
	
}