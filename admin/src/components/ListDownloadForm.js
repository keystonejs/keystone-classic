import classnames from 'classnames';
import React from 'react';

var Transition = React.addons.CSSTransitionGroup;
var CurrentListStore = require('../stores/CurrentListStore');
var Popout = require('./Popout');
var PopoutList = require('./PopoutList');

var { Button, Checkbox, Form, FormField, InputGroup, SegmentedControl } = require('elemental');

const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

var ListDownloadForm = React.createClass({
	displayName: 'ListDownloadForm',
	propTypes: {
		columns: React.PropTypes.array,
		isOpen: React.PropTypes.bool,
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

	toggleCurrentlySelectedColumns (e) {
		let newState = {
			useCurrentColumns: !this.state.useCurrentColumns
		};

		// clear selected fields
		if (e.target.value) {
			newState.selectedColumns =  {};
		}

		this.setState(newState);
	},

	handleDownloadRequest () {
		console.info(`Download ${this.state.format.toUpperCase()} with columns:`, Object.keys(this.state.selectedColumns));
		this.togglePopout(false);
	},

	renderColumnSelect () {
		if (this.state.useCurrentColumns) return null;

		let possibleColumns = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			let columnKey = el.field.path;
			let columnValue = this.state.selectedColumns[columnKey];

			return (
				<PopoutList.Item
					key={'item_' + el.field.path}
					icon={columnValue ? 'check' : 'dash'}
					iconHover={columnValue ? 'dash' : 'check'}
					isSelected={columnValue}
					label={el.field.label}
					onClick={this.toggleColumn.bind(this, columnKey, !columnValue)} />
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
			<InputGroup.Section className={this.props.className}>
				<Button id="listHeaderDownloadButton" isActive={this.state.isOpen} onClick={this.togglePopout.bind(this, !this.state.isOpen)}>
					<span className={this.props.className + '__icon octicon octicon-cloud-download'} />
					<span className={this.props.className + '__label'}>Download</span>
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={this.togglePopout.bind(this, false)} relativeToID="listHeaderDownloadButton">
					<Popout.Header title="Download" />
					<Popout.Body scrollable>
						<Form type="horizontal" component="div">
							<FormField label="File format:">
								<SegmentedControl equalWidthSegments options={FORMAT_OPTIONS} value={this.state.format} onChange={this.changeFormat} />
							</FormField>
							<FormField label="Columns:">
								<Checkbox focusOnMount label="Use currently selected" onChange={this.toggleCurrentlySelectedColumns} value={true} checked={useCurrentColumns} />
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
