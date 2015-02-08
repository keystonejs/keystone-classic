var Select = require('react-select'),
	React = require('react'),
	Field = require('../Field'),
	Note = require('../../components/Note'),
	superagent = require('superagent'),
	_ = require('underscore');

module.exports = Field.create({
	
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
		
		_.each(inputs, function(input) {
			superagent
				.get('/keystone/api/' + self.props.refList.path + '/get?dataset=simple&id=' + input)
				.set('Accept', 'application/json')
				.end(function (err, res) {
					if (err) throw err;
					
					var value = res.body;
					
					expandedValues.push({
						value: value.id,
						label: value.name
					});
					
					if (expandedValues.length === inputs.length) {
						finish();
					}
				});
		});
	},
	
	buildFilters: function() {
		var filters = {};
		
		_.each(this.props.filters, function(value, key) {
			if(_.isString(value) && value[0] == ':') {
				fieldName = value.slice(1);

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
		})
		
		return parts.join('&');
	},

	buildOptionQuery: function (input) {
		return 'context=relationship&q=' + input + '&list=' + Keystone.list.path + '&field=' + this.props.path + '&' + this.buildFilters()
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
		// TODO expand IDs
		if (this.props.many) {
			// a(href='/keystone/' + refList.path + '/' + item.get(field.path), data-ref-path=refList.path).ui-related-item= item.get(field.path)
			return <div className='field-value'>{this.props.value}</div>;
		} else if (this.props.many && this.props.value.length) {
			// var body = [];
			// 
			// _.each(this.props.value, function (value) {
			// 	body.push(<a href={'/keystone/' + this.props.refList.path + '/' + value} className='ui-related-item'>{value}</a>);
			// }, this);
			// 
			// return value;
			return <div className='field-value'>{this.props.value}</div>;
		} else {
			return <div className='field-value'>(not set)</div>;
		}
	},
	
	renderField: function() {
		if (!this.state.ready) {
			return this.renderLoadingUI();
		}
		var body = [];
		
		body.push(<Select multi={this.props.many} onChange={this.updateValue} name={this.props.path} asyncOptions={this.getOptions} value={this.state.expandedValues} />);
		
		if (!this.props.many && this.props.value) {
			body.push(
				<a href={'/keystone/' + this.props.refList.path + '/' + this.props.value} className='btn btn-link btn-goto-linked-item'>
					view {this.props.refList.singular.toLowerCase()}
				</a>
			);
		}
		
		return body;
	}
	
});
