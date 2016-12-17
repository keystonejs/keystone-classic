import React, { PropTypes } from 'react';
import assign from 'object-assign';
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import ListHeaderButton from './ListHeaderButton';
import { LabelledControl, Form, FormField, SegmentedControl } from '../../../elemental';

import { downloadItems } from '../actions';
const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

var ListDownloadForm = React.createClass({
	propTypes: {
		activeColumns: PropTypes.array,
		dispatch: PropTypes.func.isRequired,
		list: PropTypes.object,
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
		this.props.activeColumns.forEach(col => {
			selectedColumns[col.path] = true;
		});
		return selectedColumns;
	},
	getListUIElements () {
		return this.props.list.uiElements.map((el) => {
			return el.type === 'field' ? {
				type: 'field',
				field: this.props.list.fields[el.field],
			} : el;
		});
	},
	allColumnsSelected () {
		const selectedColumns = Object.keys(this.state.selectedColumns).length;
		const columnAmount = this.getListUIElements().filter((el) => el.type !== 'heading').length;
		return selectedColumns === columnAmount;
	},
	togglePopout (visible) {
		this.setState({
			isOpen: visible,
		});
	},
	toggleColumn (column, value) {
		const newColumns = assign({}, this.state.selectedColumns);
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
		const newState = {
			useCurrentColumns: e.target.checked,
			selectedColumns: this.getDefaultSelectedColumns(),
		};
		this.setState(newState);
	},
	clickSelectAll () {
		if (this.allColumnsSelected()) {
			this.selectNoColumns();
		} else {
			this.selectAllColumns();
		}
	},
	selectAllColumns () {
		const newColumns = {};
		this.getListUIElements().map((el) => {
			if (el.type !== 'heading') {
				newColumns[el.field.path] = true;
			}
		});
		this.setState({
			selectedColumns: newColumns,
		});
	},
	selectNoColumns () {
		this.setState({
			selectedColumns: {},
		});
	},
	handleDownloadRequest () {
		this.props.dispatch(downloadItems(this.state.format, Object.keys(this.state.selectedColumns)));
		this.togglePopout(false);
	},
	renderColumnSelect () {
		if (this.state.useCurrentColumns) return null;

		const possibleColumns = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			const columnKey = el.field.path;
			const columnValue = this.state.selectedColumns[columnKey];

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

		const allColumnsSelected = this.allColumnsSelected();
		const checkboxLabel = allColumnsSelected ? 'Select None' : 'Select All';

		return (
			<div>
				<FormField offsetAbsentLabel>
					<LabelledControl
						checked={allColumnsSelected}
						label={checkboxLabel}
						onChange={this.clickSelectAll}
						type="checkbox"
						value
					/>
				</FormField>
				<div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', marginTop: '1em', paddingTop: '1em' }}>
					{possibleColumns}
				</div>
			</div>
		);
	},
	render () {
		const { useCurrentColumns } = this.state;

		return (
			<div>
				<ListHeaderButton
					active={this.state.isOpen}
					id="listHeaderDownloadButton"
					glyph="cloud-download"
					label="Download"
					onClick={() => this.togglePopout(!this.state.isOpen)}
				/>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderDownloadButton">
					<Popout.Header title="Download" />
					<Popout.Body scrollable>
						<Form layout="horizontal" labelWidth={100} component="div">
							<FormField label="File format:">
								<SegmentedControl
									equalWidthSegments
									onChange={this.changeFormat}
									options={FORMAT_OPTIONS}
									value={this.state.format}
								/>
							</FormField>
							<FormField label="Columns:" style={{ marginBottom: 0 }}>
								<LabelledControl
									autoFocus
									checked={useCurrentColumns}
									label="Use currently selected"
									onChange={this.toggleCurrentlySelectedColumns}
									type="checkbox"
									value
								/>
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
			</div>
		);
	},
});

module.exports = ListDownloadForm;
