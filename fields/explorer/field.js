import Domify from 'react-domify';
import React from 'react';
import { Link, Router, Route, browserHistory, IndexRoute } from 'react-router';

import { Col, Row } from 'elemental';

const Types = {
	Boolean: require('../types/boolean/test/explorer'),
	Color: require('../types/color/test/explorer'),
	Date: require('../types/date/test/explorer'),
	Datetime: require('../types/datetime/test/explorer'),
	Email: require('../types/email/test/explorer'),
	Key: require('../types/key/test/explorer'),
	Name: require('../types/name/test/explorer'),
	Password: require('../types/password/test/explorer'),
	Text: require('../types/text/test/explorer'),
	Textarea: require('../types/textarea/test/explorer'),
	Textarray: require('../types/textarray/test/explorer'),
	Url: require('../types/url/test/explorer'),
};

const ExplorerFieldType = React.createClass({
	getInitialState () {
		const FilterComponent = Types[this.props.params.type].Filter;
		return {
			value: Types[this.props.params.type].value,
			filter: FilterComponent.getDefaultValue(),
		};
	},
	componentWillReceiveProps (newProps) {
		if (this.props.params.type === newProps.params.type) return;
		const FilterComponent = Types[newProps.params.type].Filter;
		this.setState({
			value: Types[newProps.params.type].value,
			filter: FilterComponent.getDefaultValue(),
		});
	},
	onFieldChange (e) {
		var logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.params.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	onFilterChange (value) {
		console.log(`${this.props.params.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	render () {
		const { type } = this.props.params;
		const FieldComponent = Types[type].Field;
		const FilterComponent = Types[type].Filter;
		const spec = Types[type].spec;
		return (
			<div className="fx-page">
				<div className="fx-page__header">{type}</div>
				<div className="fx-page__content">
					<Row>
						<Col sm={300}>
							<FieldComponent {...spec} onChange={this.onFieldChange} value={this.state.value} />
						</Col>
						<Col style={{ paddingLeft: 50, width: 'auto' }}>
							<Domify className="Domify" value={{ value: this.state.value }} />
						</Col>
					</Row>
					<h3>Filter</h3>
					<Row>
						<Col sm={300}>
							<FilterComponent field={spec} onChange={this.onFilterChange} filter={this.state.filter} />
						</Col>
						<Col style={{ paddingLeft: 50, width: 'auto' }}>
							<Domify className="Domify" value={this.state.filter} />
						</Col>
					</Row>
				</div>
			</div>
		);
	},
});

module.exports = ExplorerFieldType;
