var _ = require('lodash');
var FieldType = require('../Type');
var https = require('https');
var keystone = require('../../../');
var querystring = require('querystring');
var util = require('util');
var utils = require('keystone-utils');

var RADIUS_KM = 6371;
var RADIUS_MILES = 3959;

/**
 * Location FieldType Constructor
 */
function location (list, path, options) {

	this._underscoreMethods = ['format', 'googleLookup', 'kmFrom', 'milesFrom'];
	this._fixedSize = 'full';
	this._properties = ['enableMapsAPI'];
	this.enableMapsAPI = (options.enableImprove === true || (options.enableImprove !== false && keystone.get('google server api key'))) ? true : false;

	// Throw on invalid options in 4.0 (remove for 5.0)
	if ('geocodeGoogle' in options) {
		throw new Error('The geocodeGoogle option for Location fields has been renamed to enableImprove');
	}

	if (!options.defaults) {
		options.defaults = {};
	}

	if (options.required) {
		if (Array.isArray(options.required)) {
			// required can be specified as an array of paths
			this.requiredPaths = options.required;
		} else if (typeof options.required === 'string') {
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
location.properName = 'Location';
util.inherits(location, FieldType);

/**
 * Registers the field on the List's Mongoose Schema.
 */
location.prototype.addToSchema = function (schema) {

	var field = this;
	var options = this.options;

	var paths = this.paths = {
		number: this.path + '.number',
		name: this.path + '.name',
		street1: this.path + '.street1',
		street2: this.path + '.street2',
		suburb: this.path + '.suburb',
		state: this.path + '.state',
		postcode: this.path + '.postcode',
		country: this.path + '.country',
		geo: this.path + '.geo',
		geo_lat: this.path + '.geo_lat',
		geo_lng: this.path + '.geo_lng',
		serialised: this.path + '.serialised',
		improve: this.path + '_improve',
		overwrite: this.path + '_improve_overwrite',
	};

	var getFieldDef = function (type, key) {
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
		geo: { type: [Number], index: '2dsphere' },
	}, this.path + '.');

	schema.virtual(paths.serialised).get(function () {
		return _.compact([
			this.get(paths.number),
			this.get(paths.name),
			this.get(paths.street1),
			this.get(paths.street2),
			this.get(paths.suburb),
			this.get(paths.state),
			this.get(paths.postcode),
			this.get(paths.country),
		]).join(', ');
	});

	// pre-save hook to fix blank geo fields
	// see http://stackoverflow.com/questions/16388836/does-applying-a-2dsphere-index-on-a-mongoose-schema-force-the-location-field-to
	schema.pre('save', function (next) {
		var obj = field._path.get(this);
		var geo = (obj.geo || []).map(Number).filter(_.isFinite);
		obj.geo = (geo.length === 2) ? geo : undefined;
		next();
	});

	this.bindUnderscoreMethods();
};

/**
 * Add filters to a query
 */
var FILTER_PATH_MAP = {
	street: 'street1',
	city: 'suburb',
	state: 'state',
	code: 'postcode',
	country: 'country',
};
location.prototype.addFilterToQuery = function (filter) {
	var query = {};
	var field = this;
	['street', 'city', 'state', 'code', 'country'].forEach(function (i) {
		if (!filter[i]) return;
		var value = utils.escapeRegExp(filter[i]);
		value = new RegExp(value, 'i');
		query[field.paths[FILTER_PATH_MAP[i]]] = filter.inverted ? { $not: value } : value;
	});
	return query;
};

/**
 * Formats a list of the values stored by the field. Only paths that
 * have values will be included.
 *
 * Optionally provide a space-separated list of values to include.
 *
 * Delimiter defaults to `', '`.
 */
location.prototype.format = function (item, values, delimiter) {
	if (!values) {
		return item.get(this.paths.serialised);
	}
	var paths = this.paths;
	values = values.split(' ').map(function (i) {
		return item.get(paths[i]);
	});
	return _.compact(values).join(delimiter || ', ');
};

/**
 * Detects whether the field has been modified
 */
location.prototype.isModified = function (item) {
	return item.isModified(this.paths.number)
	|| item.isModified(this.paths.name)
	|| item.isModified(this.paths.street1)
	|| item.isModified(this.paths.street2)
	|| item.isModified(this.paths.suburb)
	|| item.isModified(this.paths.state)
	|| item.isModified(this.paths.postcode)
	|| item.isModified(this.paths.country)
	|| item.isModified(this.paths.geo);
};

location.prototype.getInputFromData = function (data) {
	// Allow JSON structured data
	var input = this.getValueFromData(data);

	// If there is no structured data, look for the flat paths
	if (!input) {
		input = {
			number: data[this.paths.number],
			name: data[this.paths.name],
			street1: data[this.paths.street1],
			street2: data[this.paths.street2],
			suburb: data[this.paths.suburb],
			state: data[this.paths.state],
			postcode: data[this.paths.postcode],
			country: data[this.paths.country],
			geo: data[this.paths.geo],
			geo_lat: data[this.paths.geo],
			geo_lng: data[this.paths.geo],
			improve: data[this.paths_improve],
			overwrite: data[this.paths_improve_overwrite],
		};
	}

	return input;
};

/**
 * Validates that a value for this field has been provided in a data object
 */
location.prototype.validateInput = function (data, callback) {
	// var input = this.getInputFromData(data);
	// TODO: We should strictly check for types in input here
	utils.defer(callback, true);
};

/**
 * Validates that input has been provided
 * TODO: Needs test coverage
 */
location.prototype.validateRequiredInput = function (item, data, callback) {
	var result = true;
	var input = this.getInputFromData(data);
	var currentValue = item.get(this.path);
	this.requiredPaths.forEach(function (path) {
		// ignore missing values if they already exist in the item
		if (input[path] === undefined && currentValue[path]) return;
		// falsy values mean the input is invalid
		if (!input[path]) {
			result = false;
		}
	});
	utils.defer(callback, result);
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * options.required specifies an array or space-delimited list of paths that
 * are required (defaults to street1, suburb)
 *
 * Deprecated
 */
location.prototype.inputIsValid = function (data, required, item) {
	if (!required) return true;
	var paths = this.paths;
	var nested = this._path.get(data);
	var values = nested || data;
	var valid = true;
	this.requiredPaths.forEach(function (path) {
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
 */
location.prototype.updateItem = function (item, data, callback) {

	var paths = this.paths;
	var fieldKeys = ['number', 'name', 'street1', 'street2', 'suburb', 'state', 'postcode', 'country'];
	var geoKeys = ['geo', 'geo_lat', 'geo_lng'];
	var valueKeys = fieldKeys.concat(geoKeys);
	var valuePaths = valueKeys;
	var values = this._path.get(data);

	if (!values) {
		// Handle flattened values
		valuePaths = valueKeys.map(function (i) {
			return paths[i];
		});
		values = _.pick(data, valuePaths);
	}

	// convert valuePaths to a map for easier usage
	valuePaths = _.zipObject(valueKeys, valuePaths);

	var setValue = function (key) {
		if (valuePaths[key] in values && values[valuePaths[key]] !== item.get(paths[key])) {
			item.set(paths[key], values[valuePaths[key]] || null);
		}
	};

	_.forEach(fieldKeys, setValue);

	if (valuePaths.geo in values) {
		var oldGeo = item.get(paths.geo) || [];
		if (oldGeo.length > 1) {
			oldGeo[0] = item.get(paths.geo)[1];
			oldGeo[1] = item.get(paths.geo)[0];
		}
		var newGeo = values[valuePaths.geo];
		if (!Array.isArray(newGeo) || newGeo.length !== 2) {
			newGeo = [];
		}
		if (newGeo[0] !== oldGeo[0] || newGeo[1] !== oldGeo[1]) {
			item.set(paths.geo, newGeo);
		}
	} else if (valuePaths.geo_lat in values && valuePaths.geo_lng in values) {
		var lat = utils.number(values[valuePaths.geo_lat]);
		var lng = utils.number(values[valuePaths.geo_lng]);
		item.set(paths.geo, (lat && lng) ? [lng, lat] : undefined);
	}

	var doGoogleLookup = this.getValueFromData(data, '_improve');
	if (doGoogleLookup) {
		var googleUpdateMode = this.getValueFromData(data, '_improve_overwrite') ? 'overwrite' : true;
		this.googleLookup(item, false, googleUpdateMode, function (err, location, result) {
			// TODO: we are currently discarding the error; it should probably be
			// sent back in the response, needs consideration
			callback();
		});
		return;
	}

	process.nextTick(callback);
};

/**
 * Internal Google geocode request method
 */
function doGoogleGeocodeRequest (address, region, callback) {

	// https://developers.google.com/maps/documentation/geocoding/
	// Use of the Google Geocoding API is subject to a query limit of 2,500 geolocation requests per day, except with an enterprise license.
	// Note: the Geocoding API may only be used in conjunction with a Google map; geocoding results without displaying them on a map is prohibited.
	// Please make sure your Keystone app complies with the Google Maps API License.

	var options = {
		sensor: false,
		language: 'en',
		address: address,
	};

	if (arguments.length === 2 && typeof region === 'function') {
		callback = region;
		region = null;
	}

	if (region) {
		options.region = region;
	}

	if (keystone.get('google server api key')) {
		options.key = keystone.get('google server api key');
	}

	var endpoint = 'https://maps.googleapis.com/maps/api/geocode/json?' + querystring.stringify(options);

	https.get(endpoint, function (res) {
		var data = [];
		res.on('data', function (chunk) {
			data.push(chunk);
		})
		.on('end', function () {
			var dataBuff = data.join('').trim();
			var result;
			try {
				result = JSON.parse(dataBuff);
			}
			catch (exp) {
				result = {
					status_code: 500,
					status_text: 'JSON Parse Failed',
					status: 'UNKNOWN_ERROR',
				};
			}
			callback(null, result);
		});
	})
	.on('error', function (err) {
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
 */
location.prototype.googleLookup = function (item, region, update, callback) {

	if (typeof update === 'function') {
		callback = update;
		update = false;
	}

	var field = this;
	var stored = item.get(this.path);
	var address = item.get(this.paths.serialised);

	if (address.length === 0) {
		return callback({
			status_code: 500,
			status_text: 'No address to geocode',
			status: 'NO_ADDRESS',
		});
	}

	doGoogleGeocodeRequest(address, region || keystone.get('default region'), function (err, geocode) {

		if (err || geocode.status !== 'OK') {
			return callback(err || new Error(geocode.status + ': ' + geocode.error_message));
		}

		// use the first result
		// if there were no results in the array, status would be ZERO_RESULTS
		var result = geocode.results[0];

		// parse the address components into a location object

		var location = {};

		_.forEach(result.address_components, function (val) {
			if (_.indexOf(val.types, 'street_number') >= 0) {
				location.street1 = [val.long_name];
			}
			if (_.indexOf(val.types, 'route') >= 0) {
				location.street1 = location.street1 || [];
				location.street1.push(val.short_name);
			}
			// in some cases, you get suburb, city as locality - so only use the first
			if (_.indexOf(val.types, 'locality') >= 0 && !location.suburb) {
				location.suburb = val.long_name;
			}
			if (_.indexOf(val.types, 'administrative_area_level_1') >= 0) {
				location.state = val.short_name;
			}
			if (_.indexOf(val.types, 'country') >= 0) {
				location.country = val.long_name;
			}
			if (_.indexOf(val.types, 'postal_code') >= 0) {
				location.postcode = val.short_name;
			}
		});

		if (Array.isArray(location.street1)) {
			location.street1 = location.street1.join(' ');
		}

		location.geo = [
			result.geometry.location.lng,
			result.geometry.location.lat,
		];

		// console.log('------ Google Geocode Results ------');
		// console.log(address);
		// console.log(result);
		// console.log(location);

		if (update === 'overwrite') {
			item.set(field.path, location);
		} else if (update) {
			_.forEach(location, function (value, key) {
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
 */
function calculateDistance (point1, point2) {
	var dLng = (point2[0] - point1[0]) * Math.PI / 180;
	var dLat = (point2[1] - point1[1]) * Math.PI / 180;
	var lat1 = (point1[1]) * Math.PI / 180;
	var lat2 = (point2[1]) * Math.PI / 180;
	/* eslint-disable space-infix-ops */
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	/* eslint-enable space-infix-ops */
	return c;
}

/**
 * Returns the distance from a [lng, lat] point in kilometres
 */
location.prototype.kmFrom = function (item, point) {
	return calculateDistance(item.get(this.paths.geo), point) * RADIUS_KM;
};

/**
 * Returns the distance from a [lng, lat] point in miles
 */
location.prototype.milesFrom = function (item, point) {
	return calculateDistance(item.get(this.paths.geo), point) * RADIUS_MILES;
};

/* Export Field Type */
module.exports = location;
