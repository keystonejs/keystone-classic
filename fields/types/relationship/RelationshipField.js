import async from 'async';
import Lists from '../../../admin/client/stores/Lists';
import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import xhr from 'xhr';
import { Button, FormInput, InputGroup } from 'elemental';

function compareValues (current, next) {
	let currentLength = current ? current.length : 0;
	let nextLength = next ? next.length : 0;
	if (currentLength !== nextLength) return false;
	for (let i = 0; i < currentLength; i++) {
		if (current[i] !== next[i]) return false;
	}
	return true;
}

module.exports = Field.create({

	displayName: 'RelationshipField',

	getInitialState () {
		return {
			value: null,
			createIsOpen: false,
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

		_.forEach(this.props.filters, (value, key) => {
			if (_.isString(value) && value[0] == ':') { // eslint-disable-line eqeqeq
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

		_.forEach(filters, function (val, key) {
			parts.push('filters[' + key + '][value]=' + encodeURIComponent(val));
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

	// NOTE: this seems like the wrong way to add options to the Select
	loadOptionsCallback: {},
	loadOptions (input, callback) {
		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback = callback;
		let filters = this.buildFilters();
		xhr({
			url: Keystone.adminPath + '/api/' + this.props.refList.path + '?basic&search=' + input + '&' + filters,
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

	toggleCreate (visible) {
		this.setState({
			createIsOpen: visible,
		});
	},

	onCreate (item) {
		this.cacheItem(item);
		if (Array.isArray(this.state.value)) {
			// For many relationships, append the new item to the end
			let values = this.state.value.map((item) => item.id);
			values.push(item.id);
			this.valueChanged(values.join(','));
		} else {
			this.valueChanged(item.id);
		}

		// NOTE: this seems like the wrong way to add options to the Select
		this.loadOptionsCallback(null, {
			complete: true,
			options: Object.keys(this._itemsCache).map((k) => this._itemsCache[k]),
		});
		this.toggleCreate(false);
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

	renderInputGroup () {
		// TODO: find better solution
		//   when importing the CreateForm using: import CreateForm from '../../../admin/client/components/CreateForm';
		//   CreateForm was imported as a blank object. This stack overflow post suggested lazilly requiring it:
		// http://stackoverflow.com/questions/29807664/cyclic-dependency-returns-empty-object-in-react-native
		let CreateForm = require('../../../admin/client/components/CreateForm');
		return (
			<InputGroup>
				<InputGroup.Section grow>
					{this.renderSelect()}
				</InputGroup.Section>
				<InputGroup.Section>
					<Button onClick={() => this.toggleCreate(true)} type="success">+</Button>
				</InputGroup.Section>
				<CreateForm
					list={Lists[this.props.refList.key]}
					isOpen={this.state.createIsOpen}
					onCreate={(data) => this.onCreate(data)}
					onCancel={() => this.toggleCreate(false)} />
			</InputGroup>
		);
	},

	renderValue () {
		return this.renderSelect(true);
	},

	renderField () {
		if (this.props.createInline) {
			return this.renderInputGroup();
		} else {
			return this.renderSelect();
		}
	},

});
