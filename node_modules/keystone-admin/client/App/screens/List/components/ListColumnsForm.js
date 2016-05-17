import React from 'react';
import ReactDOM from 'react-dom';
import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';
import { Button, InputGroup, FormField, FormInput } from 'elemental';

import { setActiveColumns } from '../actions';

var ListColumnsForm = React.createClass({
	displayName: 'ListColumnsForm',
	propTypes: {
		className: React.PropTypes.string.isRequired,
	},
	getInitialState () {
		return {
			selectedColumns: {},
			searchString: '',
		};
	},
	getSelectedColumnsFromStore () {
		var selectedColumns = {};
		this.props.activeColumns.forEach(col => {
			selectedColumns[col.path] = true;
		});
		return selectedColumns;
	},
	togglePopout (visible) {
		this.setState({
			selectedColumns: this.getSelectedColumnsFromStore(),
			isOpen: visible,
			searchString: '',
		}, () => {
			if (visible) {
				ReactDOM.findDOMNode(this.refs.search).focus();
			}
		});
	},
	toggleColumn (path, value) {
		const newColumns = Object.assign({}, this.state.selectedColumns);

		if (value) {
			newColumns[path] = value;
		} else {
			delete newColumns[path];
		}

		this.setState({
			selectedColumns: newColumns,
		});
	},
	applyColumns () {
		this.props.dispatch(setActiveColumns(Object.keys(this.state.selectedColumns)));
		this.togglePopout(false);
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	renderColumns () {
		const availableColumns = this.props.availableColumns;
		const { searchString } = this.state;
		let filteredColumns = availableColumns;

		if (searchString) {
			filteredColumns = filteredColumns
				.filter(column => column.type !== 'heading')
				.filter(column => new RegExp(searchString).test(column.field.label.toLowerCase()));
		}

		return filteredColumns.map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}

			const path = el.field.path;
			const selected = this.state.selectedColumns[path];

			return (
				<PopoutList.Item
					key={'column_' + el.field.path}
					icon={selected ? 'check' : 'dash'}
					iconHover={selected ? 'dash' : 'check'}
					isSelected={!!selected}
					label={el.field.label}
					onClick={() => { this.toggleColumn(path, !selected); }} />
			);
		});
	},
	render () {
		return (
			<InputGroup.Section className={this.props.className}>
				<Button ref="target" id="listHeaderColumnButton" isActive={this.state.isOpen} onClick={() => this.togglePopout(!this.state.isOpen)}>
					<span className={this.props.className + '__icon octicon octicon-list-unordered'} />
					<span className={this.props.className + '__label'}>Columns</span>
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={() => this.togglePopout(false)} relativeToID="listHeaderColumnButton">
					<Popout.Header title="Columns" />
					<Popout.Body scrollable>
						<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
							<FormInput ref="search" value={this.state.searchString} onChange={this.updateSearch} placeholder="Find a column..." />
						</FormField>
						<PopoutList>
							{this.renderColumns()}
						</PopoutList>
					</Popout.Body>
					<Popout.Footer
						primaryButtonAction={this.applyColumns}
						primaryButtonLabel="Apply"
						secondaryButtonAction={() => this.togglePopout(false)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</InputGroup.Section>
		);
	},
});

module.exports = ListColumnsForm;
