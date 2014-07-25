/*!
 * Module dependencies.
 */

var _ = require('underscore'),
	keystone = require('../../'),
	querystring = require('querystring'),
	https = require('https'),
	util = require('util'),
	utils = require('keystone-utils'),
	super_ = require('../field');

var RADIUS_KM = 6371,
	RADIUS_MILES = 3959;

/**
 * Location FieldType Constructor
 * @extends Field
 * @api public
 */

function location(list, path, options) {

	this._underscoreMethods = ['format', 'googleLookup', 'kmFrom', 'milesFrom'];

	this.enableMapsAPI = keystone.get('google api key') ? true : false;

	if (!options.defaults) {
		options.defaults = {};
	}

	if (options.required) {
		if (Array.isArray(options.required)) {
			// required can be specified as an array of paths
			this.requiredPaths = options.required;
		} else if ('string' === typeof options.required) {
			// or it can be specified as a comma-delimited list
			this.requiredPaths = options.required.replace(/,/g, ' ').split(/\s+/);
		}
		// options.required should always be simplified to a boolean
		options.required = true;
	}
	// default this.requiredPaths
	if (!this.requiredPaths) {
		this.requiredPaths = ['street1', 'suburb'];
	}

	location.super_.call(this, list, path, options);

}

/*!
 * Inherit from Field
 */

util.inherits(location, super_);


/**
 * Registers the field on the List's Mongoose Schema.
 *
 * @api public
 */

location.prototype.addToSchema = function() {

	var field = this,
		schema = this.list.schema,
		options = this.options;

	var paths = this.paths = {
		number: this._path.append('.number'),
		name: this._path.append('.name'),
		street1: this._path.append('.street1'),
		street2: this._path.append('.street2'),
		suburb: this._path.append('.suburb'),
		state: this._path.append('.state'),
		postcode: this._path.append('.postcode'),
		country: this._path.append('.country'),
		geo: this._path.append('.geo'),
		geo_lat: this._path.append('.geo_lat'),
		geo_lng: this._path.append('.geo_lng'),
		serialised: this._path.append('.serialised'),
		improve: this._path.append('_improve'),
		overwrite: this._path.append('_improve_overwrite')
	};

	var getFieldDef = function(type, key) {
		var def = { type: type };
		if (options.defaults[key]) {
			def.default = options.defaults[key];
		}
		return def;
	};

	schema.nested[this.path] = true;
	schema.add({
		number: getFieldDef(String, 'number'),
		name: getFieldDef(String, 'name'),
		street1: getFieldDef(String, 'street1'),
		street2: getFieldDef(String, 'street2'),
		street3: getFieldDef(String, 'street3'),
		suburb: getFieldDef(String, 'suburb'),
		state: getFieldDef(String, 'state'),
		postcode: getFieldDef(String, 'postcode'),
		country: getFieldDef(String, 'country'),
		geo: { type: [Number], index: '2dsphere' }
	}, this.path + '.');

	schema.virtual(paths.serialised).get(function() {
		return _.compact([
			this.get(paths.number),
			this.get(paths.name),
			this.get(paths.street1),
			this.get(paths.street2),
			this.get(paths.suburb),
			this.get(paths.state),
			this.get(paths.postcode),
			this.get(paths.country)
		]).join(', ');
	});

	// pre-save hook to fix blank geo fields
	// see http://stackoverflow.com/questions/16388836/does-applying-a-2dsphere-index-on-a-mongoose-schema-force-the-location-field-to
	schema.pre('save', function(next) {
		var obj = field._path.get(this);
		if (Array.isArray(obj.geo) && (obj.geo.length !== 2 || (obj.geo[0] === null && obj.geo[1] === null))) {
			obj.geo = undefined;
		}
		next();
	});

	this.bindUnderscoreMethods();

};


/**
 * Formats a list of the values stored by the field. Only paths that
 * have values will be included.
 *
 * Optionally provide a space-separated list of values to include.
 *
 * Delimiter defaults to `', '`.
 *
 * @api public
 */

location.prototype.format = function(item, values, delimiter) {

	if (!values) {
		return item.get(this.paths.serialised);
	}

	var paths = this.paths;

	values = values.split(' ').map(function(i) {
		return item.get(paths[i]);
	});

	return _.compact(values).join(delimiter || ', ');

};


/**
 * Detects whether the field has been modified
 *
 * @api public
 */

location.prototype.isModified = function(item) {
	return item.isModified(this.paths.number) ||
		item.isModified(this.paths.name) ||
		item.isModified(this.paths.street1) ||
		item.isModified(this.paths.street2) ||
		item.isModified(this.paths.suburb) ||
		item.isModified(this.paths.state) ||
		item.isModified(this.paths.postcode) ||
		item.isModified(this.paths.country) ||
		item.isModified(this.paths.geo);
};


/**
 * Validates that a value for this field has been provided in a data object
 *
 * options.required specifies an array or space-delimited list of paths that
 * are required (defaults to street1, suburb)
 *
 * @api public
 */

location.prototype.validateInput = function(data, required, item) {
	
	if (!required) {
		return true;
	}
	
	var paths = this.paths,
		nested = this._path.get(data),
		values = nested || data,
		valid = true;
	
	this.requiredPaths.forEach(function(path) {
		
		if (nested) {
			if (!(path in values) && item && item.get(paths[path])) {
				return;
			}
			if (!values[path]) {
				valid = false;
			}
		} else {
			if (!(paths[path] in values) && item && item.get(paths[path])) {
				return;
			}
			if (!values[paths[path]]) {
				valid = false;
			}
		}
		
	});
	
	return valid;
	
};


/**
 * Updates the value for this field in the item from a data object
 *
 * @api public
 */

location.prototype.updateItem = function(item, data) {

	var paths = this.paths,
		fieldKeys = ['number', 'name', 'street1', 'street2', 'suburb', 'state', 'postcode', 'country'],
		geoKeys = ['geo', 'geo_lat', 'geo_lng'],
		valueKeys = fieldKeys.concat(geoKeys),
		valuePaths = valueKeys,
		values = this._path.get(data);
	
	if (!values) {
		// Handle flattened values
		valuePaths = valueKeys.map(function(i) {
			return paths[i];
		});
		values = _.pick(data, valuePaths);
	}
	
	// convert valuePaths to a map for easier usage
	valuePaths = _.object(valueKeys, valuePaths);
	
	var setValue = function(key) {
		if (valuePaths[key] in values && values[valuePaths[key]] !== item.get(paths[key])) {
			item.set(paths[key], values[valuePaths[key]] || null);
		}
	};

	_.each(fieldKeys, setValue);

	if (valuePaths.geo in values) {

		var oldGeo = item.get(paths.geo) || [],
			newGeo = values[valuePaths.geo];

		if (!Array.isArray(newGeo) || newGeo.length !== 2) {
			newGeo = [];
		}

		if (newGeo[0] !== oldGeo[0] || newGeo[1] !== oldGeo[1]) {
			item.set(paths.geo, newGeo);
		}

	} else if (valuePaths.geo_lat in values && valuePaths.geo_lng in values) {

		var lat = utils.number(values[valuePaths.geo_lat]),
			lng = utils.number(values[valuePaths.geo_lng]);

		item.set(paths.geo, (lat && lng) ? [lng, lat] : undefined);

	}

};


/**
 * Returns a callback that handles a standard form submission for the field
 *
 * Handles:
 * - `field.paths.improve` in `req.body` - improves data via `.googleLookup()`
 * - `field.paths.overwrite` in `req.body` - in conjunction with `improve`, overwrites existing data
 *
 * @api public
 */

location.prototype.getRequestHandler = function(item, req, paths, callback) {

	var field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	} else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function() {};

	return function() {

		var update = req.body[paths.overwrite] ? 'overwrite' : true;

		if (req.body && req.body[paths.improve]) {
			field.googleLookup(item, false, update, function() {
				callback();
			});
		} else {
			callback();
		}

	};

};


/**
 * Immediately handles a standard form submission for the field (see `getRequestHandler()`)
 *
 * @api public
 */

location.prototype.handleRequest = function(item, req, paths, callback) {
	this.getRequestHandler(item, req, paths, callback)();
};


/**
 * Internal Google geocode request method
 *
 * @api private
 */

function doGoogleGeocodeRequest(address, region, callback) {

	// https://developers.google.com/maps/documentation/geocoding/
	// Use of the Google Geocoding API is subject to a query limit of 2,500 geolocation requests per day, except with an enterprise license.
	// Note: the Geocoding API may only be used in conjunction with a Google map; geocoding results without displaying them on a map is prohibited.
	// Please make sure your Keystone app complies with the Google Maps API License.

	var options = {
		sensor: false,
		language: 'en',
		address: address
	};

	if (arguments.length === 2 && _.isFunction(region)) {
		callback = region;
		region = null;
	}

	if (region) {
		options.region = region;
	}

	var endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?' + querystring.stringify(options);

	https.get(endpoint, function(res) {
		var data = [];
		res.on('data', function(chunk) {
				data.push(chunk);
			})
			.on('end', function() {
				var dataBuff = data.join('').trim();
				var result;
				try {
					result = JSON.parse(dataBuff);
				}
				catch (exp) {
					result = {'status_code': 500, 'status_text': 'JSON Parse Failed', 'status': 'UNKNOWN_ERROR'};
				}
				callback(null, result);
			});
	})
	.on('error', function(err) {
		callback(err);
	});
}


/**
 * Autodetect the full address and lat, lng from the stored value.
 *
 * Uses Google's Maps API and may only be used in conjunction with a Google map.
 * Geocoding results without displaying them on a map is prohibited.
 * Please make sure your Keystone app complies with the Google Maps API License.
 *
 * Internal status codes mimic the Google API status codes.
 *
 * @api private
 */

location.prototype.googleLookup = function(item, region, update, callback) {

	if (_.isFunction(update)) {
		callback = update;
		update = false;
	}

	var field = this,
		stored = item.get(this.path),
		address = item.get(this.paths.serialised);

	if (address.length === 0) {
		return callback({'status_code': 500, 'status_text': 'No address to geocode', 'status': 'NO_ADDRESS'});
	}

	doGoogleGeocodeRequest(address, region || keystone.get('default region'), function(err, geocode){

		if (err || geocode.status !== 'OK') {
			return callback(err);
		}

		// use the first result
		// if there were no results in the array, status would be ZERO_RESULTS
		var result = geocode.results[0];

		// parse the address components into a location object

		var location = {};

		_.each(result.address_components, function(val){
			if ( _.indexOf(val.types,'street_number') >= 0 ) {
				location.street1 = location.street1 || [];
				location.street1.push(val.long_name);
			}
			if ( _.indexOf(val.types,'route') >= 0 ) {
				location.street1 = location.street1 || [];
				location.street1.push(val.short_name);
			}
			// in some cases, you get suburb, city as locality - so only use the first
			if ( _.indexOf(val.types,'locality') >= 0 && !location.suburb) {
				location.suburb = val.long_name;
			}
			if ( _.indexOf(val.types,'administrative_area_level_1') >= 0 ) {
				location.state = val.short_name;
			}
			if ( _.indexOf(val.types,'country') >= 0 ) {
				location.country = val.long_name;
			}
			if ( _.indexOf(val.types,'postal_code') >= 0 ) {
				location.postcode = val.short_name;
			}
		});

		if (Array.isArray(location.street1)) {
			location.street1 = location.street1.join(' ');
		}

		location.geo = [
			result.geometry.location.lng,
			result.geometry.location.lat
		];

		//console.log('------ Google Geocode Results ------');
		//console.log(address);
		//console.log(result);
		//console.log(location);

		if (update === 'overwrite') {
			item.set(field.path, location);
		} else if (update) {
			_.each(location, function(value, key) {
				if (key === 'geo') {
					return;
				}
				if (!stored[key]) {
					item.set(field.paths[key], value);
				}
			});
			if (!Array.isArray(stored.geo) || !stored.geo[0] || !stored.geo[1]) {
				item.set(field.paths.geo, location.geo);
			}
		}

		callback(null, location, result);

	});
};


/**
 * Internal Distance calculation function
 *
 * See http://en.wikipedia.org/wiki/Haversine_formula
 *
 * @api private
 */

function calculateDistance(point1, point2) {

	var dLng = (point2[0] - point1[0]) * Math.PI / 180;
	var dLat = (point2[1] - point1[1]) * Math.PI / 180;
	var lat1 = (point1[1]) * Math.PI / 180;
	var lat2 = (point2[1]) * Math.PI / 180;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return c;

}


/**
 * Returns the distance from a [lat, lng] point in kilometres
 *
 * @api public
 */

location.prototype.kmFrom = function(item, point) {
	return calculateDistance(this.get(this.paths.geo), point) * RADIUS_KM;
};


/**
 * Returns the distance from a [lat, lng] point in miles
 *
 * @api public
 */

location.prototype.milesFrom = function(item, point) {
	return calculateDistance(this.get(this.paths.geo), point) * RADIUS_MILES;
};


/*!
 * Export class
 */

exports = module.exports = location;
