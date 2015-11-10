var _ = require('underscore');
var utils = require('keystone-utils');

module.exports = function autokey() {

	var autokey = this.autokey = _.clone(this.get('autokey'));
	var def = {};
	var list = this;

	if (!autokey.from) {
		var fromMsg = 'Invalid List Option (autokey) for ' + list.key + ' (from is required)\n';
		throw new Error(fromMsg);
	}
	if (!autokey.path) {
		var pathMsg = 'Invalid List Option (autokey) for ' + list.key + ' (path is required)\n';
		throw new Error(pathMsg);
	}

	if ('string' === typeof autokey.from) {
		autokey.from = autokey.from.split(' ');
	}

	autokey.from = autokey.from.map(function(i) {
		i = i.split(':');
		return { path: i[0], format: i[1] };
	});

	def[autokey.path] = {
		type: String,
		index: true
	};

	if (autokey.unique) {
		def[autokey.path].index = { unique: true };
	}

	this.schema.add(def);

	var getUniqueKey = function(doc, src, callback) {

		var q = list.model.find().where(autokey.path, src);

		if (_.isObject(autokey.unique)) {
			_.each(autokey.unique, function(k, v) {
				if (_.isString(v) && v.charAt(0) === ':') {
					q.where(k, doc.get(v.substr(1)));
				} else {
					q.where(k, v);
				}
			});
		}

		q.exec(function(err, results) {
			if (err) {
				callback(err);
			// deliberate use of implicit type coercion with == because doc.id may need to become a String
			} else if (results.length && (results.length > 1 || results[0].id != doc.id)) { // eslint-disable-line eqeqeq
				var inc = src.match(/^(.+)\-(\d+)$/);
				if (inc && inc.length === 3) {
					src = inc[1];
					inc = '-' + ((inc[2] * 1) + 1);
				} else {
					inc = '-1';
				}
				return getUniqueKey(doc, src + inc, callback);
			} else {
				doc.set(autokey.path, src);
				return callback();
			}
		});
	};

	this.schema.pre('save', function(next) {

		var modified = false;
		var values = [];

		autokey.from.forEach(function(ops) {
			if (list.fields[ops.path]) {
				values.push(list.fields[ops.path].format(this, ops.format));
				if (list.fields[ops.path].isModified(this)) {
					modified = true;
				}
			} else {
				values.push(this.get(ops.path));
				// virtual paths are always assumed to have changed, except 'id'
				if (ops.path !== 'id' && list.schema.pathType(ops.path) === 'virtual' || this.isModified(ops.path)) {
					modified = true;
				}
			}
		}, this);

		// if has a value and is unmodified or fixed, don't update it
		if ((!modified || autokey.fixed) && this.get(autokey.path)) {
			return next();
		}
		var newKey = utils.slug(values.join(' '), null, { locale: autokey.locale }) || this.id;
		if (autokey.unique) {
			return getUniqueKey(this, newKey, next);
		} else {
			this.set(autokey.path, newKey);
			return next();
		}

	});

};
