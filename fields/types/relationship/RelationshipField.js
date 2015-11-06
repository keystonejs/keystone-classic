import async from 'async';
import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import xhr from 'xhr';
import { Button, FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'RelationshipField',

	getInitialState () {
		return {
			value: null,
		};
	},

	componentDidMount () {
		this._valuesCache = {};
		this.onValueChanged();
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

	onValueChanged () {
		let values = this.props.many ? this.props.value : [this.props.value];
		this.setState({
			loading: true,
		});
		async.map(values, (value, done) => {
			if (this._valuesCache[value]) return done(null, this._valuesCache[value]);
			xhr({
				url: '/keystone/api/' + this.props.refList.path + '/' + value + '?basic',
				responseType: 'json',
			}, (err, resp, data) => {
				if (err || !data) return done(err);
				this._valuesCache[value] = data;
				done(err, data);
			});
		}, (err, expanded) => {
			this.setState({
				loading: false,
				value: this.props.many ? expanded : expanded[0],
			});
		});
	},

	getOptions (input, callback) {
		// TODO: Implement filters
		console.log('INPUT:', input);
		xhr({
			url: '/keystone/api/' + this.props.refList.path + '?search=' + input,
			responseType: 'json',
		}, (err, resp, body) => {
			console.log(body);
			return callback(null, []);
			// async.map(values, (id, done) => {
			// 	xhr({
			// 		url: '/keystone/api/' + this.props.refList.path + '/' + id + '?basic',
			// 		responseType: 'json',
			// 	}, (err, resp, body) => {
			// 		console.log(body);
			// 		done(err, body);
			// 	});
			// }, (err, results) => {
			//
			// });
		});
	},

	renderSelect (noedit) {
		return (
			<Select
				multi={this.props.many}
				disabled={noedit}
				labelKey="name"
				name={this.props.path}
				onChange={this.valueChanged}
				value={this.state.value}
				valueKey="id"
			/>
		);
	},

	renderValue () {
		return this.renderSelect(true);
	},

	renderField () {

		// let button = (!this.props.many && this.props.value) ? (
		// 	<Button key="relational-button" type="link" href={'/keystone/' + this.props.refList.path + '/' + this.props.value} className="keystone-relational-button" title={'Go to "' + this.state.expandedValues[0].label + '"'}>
		// 		<span className="octicon octicon-file-symlink-file" />
		// 	</Button>
		// ) : null;

		return this.renderSelect();
	}

});
