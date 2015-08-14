import classnames from 'classnames';
import React from 'react';

var Transition = React.addons.CSSTransitionGroup;
var CurrentListStore = require('../stores/CurrentListStore');
var Popout = require('./Popout');

var { Button, Checkbox, Form, FormField, InputGroup, SegmentedControl } = require('elemental');

const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

var ListDownloadForm = React.createClass({
	displayName: 'ListDownloadForm',
	propTypes: {
		columns: React.PropTypes.array,
		isOpen: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
	},
	
	getDefaultProps () {
		return {
			columns: null,
			isOpen: false,
		};
	},
	
	getInitialState () {
		return {
			format: FORMAT_OPTIONS[0].value,
			isOpen: false,
			useCurrentColumns: true,
			selectedColumns: {},
		};
		
	},

	getListUIElements () {
		return Keystone.list.uiElements.map((el) => {
			return el.type === 'field' ? {
				type: 'field',
				field: Keystone.list.fields[el.field]
			} : el;
		});
	},
	
	togglePopout (visible) {
		this.setState({
			isOpen: visible
		});
	},
	
	toggleColumn (column, value) {
		let newColumns = this.state.selectedColumns;
		
		if (value) {
			newColumns[column] = value;
		} else {
			delete newColumns[column];
		}
		
		this.setState({
			selectedColumns: newColumns
		});
	},

	changeFormat (value) {
		this.setState({
			format: value
		});
	},
	
	handleDownloadRequest () {
		console.info(`Download ${this.state.format.toUpperCase()} with columns:`, Object.keys(this.state.selectedColumns));
		this.togglePopout(false);
	},
	
	renderColumnSelect () {
		if (this.state.useCurrentColumns) return null;
		
		let possibleColumns = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <div key={'item-' + i} className="Popout__list__header">{el.content}</div>
			}
			
			let columnKey = el.field.path;
			let columnValue = this.state.selectedColumns[columnKey];
			
			var itemClassname = classnames('Popout__list__item', {
				'is-selected': columnValue
			});
			var iconClassname = classnames('Popout__list__item__icon octicon',
				columnValue ? 'octicon-check' : 'octicon-dash'
			);
			
			return (
				<button type="button" key={'item-' + el.field.path} onClick={this.toggleColumn.bind(this, columnKey, !columnValue)} title={el.field.label} className={itemClassname}>
					<span className={iconClassname} />
					{el.field.label}
				</button>
			);
		});
		
		return (
			<div style={{ borderTop: '1px dashed #eee', marginTop: '1em', paddingTop: '1em' }}>
				{possibleColumns}
			</div>
		);
	},
	
	render () {
		let { list } = this.props;
		let { useCurrentColumns } = this.state;
		
		return (
			<InputGroup.Section>
				<Button isActive={this.state.isOpen} onClick={this.togglePopout.bind(this, !this.state.isOpen)}>
					Download
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={this.togglePopout.bind(this, false)}>
					<Popout.Header title="Download" />
					<Popout.Body scrollable>
						<Form type="horizontal" component="div">
							<FormField label="File format:">
								<SegmentedControl equalWidthSegments options={FORMAT_OPTIONS} value={this.state.format} onChange={this.changeFormat} />
							</FormField>
							<FormField label="Columns:">
								<Checkbox label="Use currently selected" onChange={() => this.setState({useCurrentColumns:!useCurrentColumns})} checked={useCurrentColumns} />
							</FormField>
							{this.renderColumnSelect()}
						</Form>
					</Popout.Body>
					<Popout.Footer 
						primaryButtonAction={this.handleDownloadRequest}
						primaryButtonLabel="Download"
						secondaryButtonAction={this.togglePopout.bind(this, false)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</InputGroup.Section>
		);
	}
	
});

module.exports = ListDownloadForm;
