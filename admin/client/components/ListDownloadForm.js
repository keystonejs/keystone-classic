import React from 'react';
import CurrentListStore from '../stores/CurrentListStore';
import Popout from './Popout';
import PopoutList from './PopoutList';
import { Button, Checkbox, Form, FormField, InputGroup, SegmentedControl } from 'elemental';

const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

var ListDownloadForm = React.createClass({
	propTypes: {
		className: React.PropTypes.string.isRequired,
	},
	getInitialState () {
		return {
			format: FORMAT_OPTIONS[0].value,
			isOpen: false,
			useCurrentColumns: true,
			selectedColumns: this.getDefaultSelectedColumns(),
		};
	},
	getDefaultSelectedColumns () {
		var selectedColumns = {};
		CurrentListStore.getActiveColumns().forEach(col => {
			selectedColumns[col.path] = true;
		});
		return selectedColumns;
	},
	getListUIElements () {
		return Keystone.list.uiElements.map((el) => {
			return el.type === 'field' ? {
				type: 'field',
				field: Keystone.list.fields[el.field],
			} : el;
		});
	},
	togglePopout (visible) {
		this.setState({
			isOpen: visible,
		});
	},
	toggleColumn (column, value) {
		let newColumns = Object.assign({}, this.state.selectedColumns);
		if (value) {
			newColumns[column] = value;
		} else {
			delete newColumns[column];
		}
		this.setState({
			selectedColumns: newColumns,
		});
	},
	changeFormat (value) {
		this.setState({
			format: value,
		});
	},
	toggleCurrentlySelectedColumns (e) {
		let newState = {
			useCurrentColumns: e.target.checked,
			selectedColumns: this.getDefaultSelectedColumns(),
		};
		this.setState(newState);
	},
	handleDownloadRequest () {
		CurrentListStore.downloadItems(this.state.format, Object.keys(this.state.selectedColumns));
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
					onClick={() => this.toggleColumn(columnKey, !columnValue)} />
			);
		});

		return (
			<div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: '1em', paddingTop: '1em' }}>
				{possibleColumns}
			</div>
		);
	},
	render () {
		let { useCurrentColumns } = this.state;

		return (
			<InputGroup.Section className={this.props.className}>
				<Button id="listHeaderDownloadButton" isActive={this.state.isOpen} onClick={() => this.togglePopout(!this.state.isOpen)}>
					<span className={this.props.className + '__icon octicon octicon-cloud-download'} />
					<span className={this.props.className + '__label'}>Download</span>
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderDownloadButton">
					<Popout.Header title="Download" />
					<Popout.Body scrollable>
						<Form type="horizontal" component="div">
							<FormField label="File format:">
								<SegmentedControl equalWidthSegments options={FORMAT_OPTIONS} value={this.state.format} onChange={this.changeFormat} />
							</FormField>
							<FormField label="Columns:">
								<Checkbox autofocus label="Use currently selected" onChange={this.toggleCurrentlySelectedColumns} value checked={useCurrentColumns} />
							</FormField>
							{this.renderColumnSelect()}
						</Form>
					</Popout.Body>
					<Popout.Footer
						primaryButtonAction={this.handleDownloadRequest}
						primaryButtonLabel="Download"
						secondaryButtonAction={() => this.togglePopout(false)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</InputGroup.Section>
		);
	},
});

module.exports = ListDownloadForm;
