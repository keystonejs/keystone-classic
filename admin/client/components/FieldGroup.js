import React from 'react';
import InvalidFieldType from '../../../admin/client/components/InvalidFieldType';

import { Button, Card, Col, Row } from 'elemental';

var lastId = 0;

var FieldGroup = React.createClass({
	getInitialState () {
		return { values: this.props.data };
	},
	getFieldProps (field) {
		var props = Object.assign({}, field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'edit';

		if (field.optionsSource) {
			props.ops = this.state.values[field.optionsSource].map((value) => { return { label: value, value: value } });
		}

		return props;
	},
	handleChange (event, callback) {
		let values = Object.assign({}, this.state.values);

		values[event.path] = event.value;

		this.setState({ values }, callback);
	},
	onRemove () {
		this.props.onRemove(this.state.values);
	},
	renderItems () {
		let Fields = require('../../../admin/client/fields');

		var headings = 0;

		return this.props.list.uiElements.map((el) => {
			if (el.type === 'heading') {
				headings++;
				el.options.values = this.state.values;
				el.key = 'h-' + headings;
				return React.createElement(FormHeading, el);
			}

			if (el.type === 'field') {
				var field = this.props.list.fields[el.field];
				var props = this.getFieldProps(field);
				if ('function' !== typeof Fields[field.type]) {
					var domNode = React.createElement(InvalidFieldType, { type: field.type, path: field.path, key: field.path });
					return (
						<Col>{ domNode }</Col>
					);
				}
				if (props.dependsOn) {
					props.currentDependencies = {};
					Object.keys(props.dependsOn).forEach(dep => {
						props.currentDependencies[dep] = this.state.values[dep];
					});
				}
				props.key = field.path;
				props.nested = this.props.parentPath;
				props._id = this.props.data._id;
				var domNode = React.createElement(Fields[field.type], props);
				return (
					<Col key={ field.path + '_' + this.props.data._id }>{ domNode }</Col>
				);
			}
		}, this);
	},
	render () {
		return (
			<Card>
				<Button ref="removeObjectItemButton" onClick={ this.onRemove }>
					<span className="octicon octicon-x" />
				</Button>
				<Row>
					{ this.renderItems() }
				</Row>
			</Card>
		);
	}
});

module.exports = FieldGroup;
