import _ from 'underscore';
import async from 'async';
import Field from '../Field';
import React from 'react';
import Select from 'react-select';
import xhr from 'xhr';
import { Button, FormInput } from 'elemental';

module.exports = Field.create({

	displayName: 'RelationshipField',

	shouldCollapse () {
		if (this.props.many) {
			// many:true relationships have an Array for a value
			return this.props.collapse && !this.props.value.length;
		}
		return this.props.collapse && !this.props.value;
	},

	getInitialState () {
		return {
			ready: false,
			value: this.props.value,
			expandedValues: [],
		};
	},

	componentDidMount () {
		this.loadValues(this.props.value);
	},

	componentWillReceiveProps (newProps) {
		if (newProps.value !== this.state.simpleValue) {
			this.setState({
				ready: false,
				simpleValue: newProps.value,
				expandedValues: [],
			});
			this.loadValues(newProps.value);
		}
	},

	loadValues (input) {
		var values = _.compact([].concat(input));

		if (!values.length) {
			this.setState({
				ready: true,
			});
		}

		async.map(values, (id, done) => {
			xhr({
				url: '/keystone/api/' + this.props.refList.path + '/' + id + '?basic',
				responseType: 'json',
			}, (err, resp, body) => {
				console.log(body);
				done(err, body);
			});
		}, (err, results) => {
			// TODO: handle err
			this.setState({
				ready: true,
				expandedValues: results,
			});
		});
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

	getOptions (input, callback) {
		// TODO: Implement filters
		console.log('INPUT:', input);
		xhr({
			url: '/keystone/api/' + this.props.refList.path + '?search=' + input,
			responseType: 'json',
		}, (err, resp, body) => {
			console.log(body);
			// done(err, body);
		});
		superagent
			.get('/keystone/api/' + this.props.refList.path + '/autocomplete?' + this.buildOptionQuery(input))
			.set('Accept', 'application/json')
			.end(function (err, res) {
				if (err) throw err;

				var data = res.body;

				callback(null, {
					options: data.items.map(function (item) {
						return {
							value: item.id,
							label: item.name
						};
					}),
					complete: data.total === data.items.length
				});
			});
	},

	renderLoadingUI () {
		return <div className="help-block">loading...</div>;
	},

	updateValue (simpleValue, expandedValues) {
		this.setState({
			simpleValue: simpleValue,
			expandedValues: expandedValues
		});
		this.props.onChange({
			path: this.props.path,
			value: this.props.many ? _.pluck(expandedValues, 'value') : simpleValue
		});
	},

	renderValue () {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		// Todo: this is only a temporary fix, remodel
		if (this.state.expandedValues && this.state.expandedValues.length) {
			var body = [];

			_.each(this.state.expandedValues, function (item, i) {
				body.push(<FormInput key={i} noedit href={'/keystone/' + this.props.refList.path + '/' + item.value}>{item.label}</FormInput>);
			}, this);

			return body;
		} else {
			return <FormInput noedit>(not set)</FormInput>;
		}
	},

	renderField () {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		let button = (!this.props.many && this.props.value) ? (
			<Button key="relational-button" type="link" href={'/keystone/' + this.props.refList.path + '/' + this.props.value} className="keystone-relational-button" title={'Go to "' + this.state.expandedValues[0].label + '"'}>
				<span className="octicon octicon-file-symlink-file" />
			</Button>
		) : null;

		return (
			<div style={{ position: 'relative' }}>
				<Select multi={this.props.many} onChange={this.updateValue} name={this.props.path} asyncOptions={this.getOptions} value={this.state.expandedValues} />
				{button}
			</div>
		);
	}

});
