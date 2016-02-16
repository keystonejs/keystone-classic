import React from 'react';
import InvalidFieldType from '../../../admin/client/components/InvalidFieldType';

import { Button, Card, Col, Row } from 'elemental';

var lastId = 0;

var FieldGroup = React.createClass({
	getInitialState () {
		return { values: this.props.data, subFields: {} };
	},
	getFieldProps (field) {
		var props = Object.assign({}, field);
		props.value = this.state.values[field.path];
		props.values = this.state.values;
		props.onChange = this.handleChange;
		props.mode = 'edit';

		if (this.state.subFields[field.path]) props.subFields = this.state.subFields[field.path];
		if (this.props.subFieldValue) {
			if (field.optionsSource && this.props.subFieldValue[field.optionsSource]) {
				props.ops = this.props.subFieldValue[field.optionsSource].map((value) => { return { label: value, value: value } });
			}
		}

		return props;
	},
	handleChange (event, callback) {
		let newState = Object.assign({}, this.state);

		newState.values[event.path] = event.value;

		if (event.subFields) newState.subFields[event.path] = event.subFields;

		this.setState(newState, callback);
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
	renderCloseButton () {
		if (this.props.subFieldValue) return;
		return (
			<Button ref="removeObjectItemButton" onClick={ this.onRemove }>
				<span className="octicon octicon-x" />
			</Button>
		);
	},
	render () {
		return (
			<Card>
				{ this.renderCloseButton() }
				<Row>
					{ this.renderItems() }
				</Row>
			</Card>
		);
	}
});

module.exports = FieldGroup;
