import classnames from 'classnames';
import React from 'react';

var Transition = React.addons.CSSTransitionGroup;
var CurrentListStore = require('../stores/CurrentListStore');
var Popout = require('./Popout');
var PopoutList = require('./PopoutList');
var { Button, Checkbox, InputGroup, SegmentedControl } = require('elemental');

var ListDownloadForm = React.createClass({
	displayName: 'ListDownloadForm',
	propTypes: {
		isOpen: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func,
	},
	
	getDefaultProps () {
		return {
			isOpen: false,
		};
	},
	
	getInitialState () {
		return {
			isOpen: false,
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
	
	applyColumns () {
		console.info(`Set list columns:`, Object.keys(this.state.selectedColumns));
		this.togglePopout(false);
	},
	
	renderColumnSelect () {
		let possibleColumns = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}
			
			let columnKey = el.field.path;
			let columnValue = this.state.selectedColumns[columnKey];
			
			return <PopoutList.Item
				key={'item_' + el.field.path}
				icon={columnValue ? 'check' : 'dash'}
				isSelected={columnValue}
				label={el.field.label}
				onClick={this.toggleColumn.bind(this, columnKey, !columnValue)} />;
		});
		
		return (
			<PopoutList>
				{possibleColumns}
			</PopoutList>
		);
	},
	
	render () {
		let { list } = this.props;
		let { useCurrentColumns } = this.state;
		
		return (
			<InputGroup.Section>
				<Button isActive={this.state.isOpen} onClick={this.togglePopout.bind(this, !this.state.isOpen)}>
					Columns
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={this.togglePopout.bind(this, false)}>
					<Popout.Header title="Columns" />
					<Popout.Body scrollable>
						{this.renderColumnSelect()}
					</Popout.Body>
					<Popout.Footer 
						primaryButtonAction={this.applyColumns}
						primaryButtonLabel="Apply"
						secondaryButtonAction={this.togglePopout.bind(this, false)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</InputGroup.Section>
		);
	}
	
});

module.exports = ListDownloadForm;
