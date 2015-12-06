import async from 'async';
import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import xhr from 'xhr';
import { Button, FormInput } from 'elemental';

function compareValues(current, next) {
	if (current.length !== next.length) return false;
	for (let i = 0; i < current.length; i++) {
		if (current[i] !== next[i]) return false;
	}
	return true;
}

module.exports = Field.create({

	displayName: 'RelationshipField',

	getInitialState () {
		return {
			value: null,
		};
	},

	componentDidMount () {
		this._itemsCache = {};
		this.loadValue(this.props.value);
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.value === this.props.value || nextProps.many && compareValues(this.props.value, nextProps.value)) return;
		this.loadValue(nextProps.value);
	},

	shouldCollapse () {
		if (this.props.many) {
			// many:true relationships have an Array for a value
			return this.props.collapse && !this.props.value.length;
		}
		return this.props.collapse && !this.props.value;
	},

	buildFilters () {
		var filters = {};

		_.each(this.props.filters, function(value, key) {
			if(_.isString(value) && value[0] == ':') {//eslint-disable-line eqeqeq
				var fieldName = value.slice(1);

				var val = this.props.values[fieldName];
				if (val) {
					filters[key] = val;
					return;
				}

				// check if filtering by id and item was already saved
				if (fieldName === ':_id' && Keystone.item) {
					filters[key] = Keystone.item.id;
					return;
				}
			} else {
				filters[key] = value;
			}
		}, this);

		var parts = [];

		_.each(filters, function (val, key) {
			parts.push('filters[' + key + ']=' + encodeURIComponent(val));
		});

		return parts.join('&');
	},

	cacheItem (item) {
		item.href = Keystone.adminPath + '/' + this.props.refList.path + '/' + item.id;
		this._itemsCache[item.id] = item;
	},

	loadValue (values) {
		if (!values) {
			return this.setState({
				loading: false,
				value: null,
			});
		};
		values = Array.isArray(values) ? values : values.split(',');
		let cachedValues = values.map(i => this._itemsCache[i]).filter(i => i);
		if (cachedValues.length === values.length) {
			this.setState({
				loading: false,
				value: this.props.many ? cachedValues : cachedValues[0],
			});
			return;
		}
		this.setState({
			loading: true,
			value: null,
		});
		async.map(values, (value, done) => {
			xhr({
				url: Keystone.adminPath + '/api/' + this.props.refList.path + '/' + value + '?basic',
				responseType: 'json',
			}, (err, resp, data) => {
				if (err || !data) return done(err);
				this.cacheItem(data);
				done(err, data);
			});
		}, (err, expanded) => {
			if (!this.isMounted()) return;
			this.setState({
				loading: false,
				value: this.props.many ? expanded : expanded[0],
			});
		});
	},

	loadOptions (input, callback) {
		// TODO: Implement filters
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.refList.path + '?basic&search=' + input,
			responseType: 'json',
		}, (err, resp, data) => {
			if (err) {
				console.error('Error loading items:', err);
				return callback(null, []);
			}
			data.results.forEach(this.cacheItem);
			callback(null, {
				options: data.results,
				complete: data.results.length === data.count,
			});
		});
	},

	valueChanged (value) {
		this.props.onChange({
			path: this.props.path,
			value: value,
		});
	},

	renderSelect (noedit) {
		return (
			<Select.Async
				multi={this.props.many}
				disabled={noedit}
				loadOptions={this.loadOptions}
				labelKey="name"
				name={this.props.path}
				onChange={this.valueChanged}
				simpleValue
				value={this.state.value}
				valueKey="id"
			/>
		);
	},

	renderValue () {
		return this.renderSelect(true);
	},

	renderField () {
		return this.renderSelect();
	}

});
