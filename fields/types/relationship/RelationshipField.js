var Select = require('react-select'),
	React = require('react'),
	Field = require('../Field'),
	superagent = require('superagent'),
	_ = require('underscore');

module.exports = Field.create({

	displayName: 'RelationshipField',

	shouldCollapse: function() {
		// many:true relationships have an Array for a value
		// so need to check length instead
		if(this.props.many) {
			return this.props.collapse && !this.props.value.length;
		}

		return this.props.collapse && !this.props.value;
	},

	getInitialState: function() {
		return {
			ready: this.props.value ? false : true,
			simpleValue: this.props.value,
			expandedValues: null
		};
	},

	componentDidMount: function() {
		this.loadValues(this.props.value);
	},

	componentWillReceiveProps: function(newProps) {
		if (newProps.value !== this.state.simpleValue) {
			this.setState({
				ready: false,
				simpleValue: newProps.value,
				expandedValues: null
			});
			this.loadValues(newProps.value);
		}
	},

	loadValues: function(input) {
		var expandedValues = [];
		var inputs = _.compact([].concat(input));
		var self = this;

		var finish = function () {
			self.setState({
				ready: true,
				expandedValues: expandedValues
			});
		};

		if (!inputs.length) return finish();

		var callbackCount = 0;
		_.each(inputs, function(input) {
			expandedValues.push({
				value: input
			});
			superagent
				.get('/keystone/api/' + self.props.refList.path + '/' + input + '?simple')
				.set('Accept', 'application/json')
				.end(function (err, res) {
					if (err) {
						if (err.status === 404) {
							_.findWhere(expandedValues, { value: input }).label = input;
						} else {
							throw err;
						}
					} else {
						var value = res.body;
						_.findWhere(expandedValues, { value: value.id }).label = value.name;
					}


					callbackCount++;
					if (callbackCount === inputs.length) {
						finish();
					}
				});
		});
	},

	buildFilters: function() {
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

	buildOptionQuery: function (input) {
		return 'context=relationship&q=' + input +
				'&list=' + Keystone.list.path +
				'&field=' + this.props.path +
				'&' + this.buildFilters();
	},

	getOptions: function(input, callback) {
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

	renderLoadingUI: function() {
		return <div className='help-block'>loading...</div>;
	},

	updateValue: function(simpleValue, expandedValues) {
		this.setState({
			simpleValue: simpleValue,
			expandedValues: expandedValues
		});
		this.props.onChange({
			path: this.props.path,
			value: this.props.many ? _.pluck(expandedValues, 'value') : simpleValue
		});
	},

	renderValue: function() {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		// Todo: this is only a temporary fix, remodel
		if (this.state.expandedValues && this.state.expandedValues.length) {
			var body = [];

			_.each(this.state.expandedValues, function (item) {
				body.push(<a href={'/keystone/' + this.props.refList.path + '/' + item.value} className='related-item-link'>{item.label}</a>);
			}, this);

			return body;
		} else {
			return <div className='field-value'>(not set)</div>;
		}
	},

	renderField: function() {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		var body = [];

		if (!this.props.many && this.props.value) {
			body.push(
				<a href={'/keystone/' + this.props.refList.path + '/' + this.props.value} className='btn btn-link btn-goto-linked-item'>
					view {this.props.refList.singular.toLowerCase()}
				</a>
			);
		}

		body.push(<Select multi={this.props.many} onChange={this.updateValue} name={this.props.path} asyncOptions={this.getOptions} value={this.state.expandedValues} />);

		return body;
	}

});
