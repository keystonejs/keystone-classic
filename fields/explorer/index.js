import Domify from 'react-domify';
import React from 'react';
import ReactDOM from 'react-dom';

import { Col, Row } from 'elemental';

const Types = {
	Text: require('../types/text/test/explorer'),
};

const FieldType = React.createClass({
	getInitialState () {
		const FilterComponent = Types[this.props.type].Filter;
		return {
			value: Types[this.props.type].value,
			filter: FilterComponent.getDefaultValue(),
		};
	},
	onFieldChange (e) {
		var logValue = typeof e.value === 'string' ? `"${e.value}"` : e.value;
		console.log(`${this.props.type} field value changed:`, logValue);
		this.setState({
			value: e.value,
		});
	},
	onFilterChange (value) {
		console.log(`${this.props.type} filter value changed:`, value);
		this.setState({
			filter: value,
		});
	},
	render () {
		const FieldComponent = Types[this.props.type].Field;
		const FilterComponent = Types[this.props.type].Filter;
		const spec = Types[this.props.type].spec;
		return (
			<div className="ExplorerField">
				<h2>{this.props.type}</h2>
				<h3>Field</h3>
				<Row>
					<Col sm="1/3">
						<FieldComponent {...spec} onChange={this.onFieldChange} value={this.state.value} />
					</Col>
					<Col sm="2/3">
						<Domify value={{ value: this.state.value }} />
					</Col>
				</Row>
				<h3>Filter</h3>
				<Row>
					<Col sm="1/3">
						<FilterComponent field={spec} onChange={this.onFilterChange} filter={this.state.filter} />
					</Col>
					<Col sm="2/3">
						<Domify value={this.state.filter} />
					</Col>
				</Row>
			</div>
		);
	},
});

ReactDOM.render(
	<div>
		<h1>Fields Explorer</h1>
		<FieldType type="Text" />
	</div>,
	document.getElementById('explorer')
);
