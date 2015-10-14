import React from 'react';
import Transition from 'react-addons-css-transition-group';
import classnames from 'classnames';

var CurrentListStore = require('../stores/CurrentListStore');
var ListFiltersAddForm = require('./ListFiltersAddForm');
var Popout = require('./Popout');
var PopoutList = require('./PopoutList');
var { Button, FormField, FormInput, InputGroup } = require('elemental');

function pluck(arr, key) {
	return arr.map(obj => obj[key]);
}

var ListFiltersAdd = React.createClass({
	displayName: 'ListFiltersAdd',
	getDefaultProps () {
		return {
			maxHeight: 360
		};
	},
	getInitialState () {
		return {
			innerHeight: 0,
			isOpen: false,
			searchString: '',
			selectedField: false,
			...this.getStateFromStore()
		};
	},
	componentDidMount () {
		CurrentListStore.addChangeListener(this.updateStateFromStore);
	},
	componentWillReceiveProps (nextProps) {
		this.setState({ isOpen: nextProps.isOpen });
	},
	componentWillUnmount () {
		CurrentListStore.removeChangeListener(this.updateStateFromStore);
	},
	getStateFromStore () {
		return {
			activeFilters: CurrentListStore.getActiveFilters(),
			availableFilters: CurrentListStore.getAvailableColumns()
		};
	},
	updateStateFromStore () {
		this.setState(this.getStateFromStore());
	},
	updateSearch (e) {
		this.setState({ searchString: e.target.value });
	},
	openPopout () {
		this.setState({
			isOpen: true
		}, this.focusSearch);
	},
	closePopout () {
		this.setState({ isOpen: false, selectedField: false, searchString: '', innerHeight: 0 });
	},
	setPopoutHeight (height) {
		this.setState({ innerHeight: Math.min(this.props.maxHeight, height) });
	},
	navigateBack () {
		this.setState({
			selectedField: false,
			searchString: '',
			innerHeight: 0
		}, this.focusSearch);
	},
	focusSearch () {
		React.findDOMNode(this.refs.search).focus();
	},
	selectField (field) {
		this.setState({
			selectedField: field
		});
	},
	applyFilter (value) {
		CurrentListStore.setFilter(this.state.selectedField.path, value);
		this.closePopout();
	},
	renderList () {
		let activeFilterFields = pluck(this.state.activeFilters, 'field');
		let activeFilterPaths = pluck(activeFilterFields, 'path');

		let { availableFilters, searchString } = this.state;
		let searchRegex = new RegExp(searchString);

		function searchFilter (filter) {
			if (filter.type === 'heading') return false;
			return searchRegex.test(filter.field.label.toLowerCase());
		};

		let filteredFilters = searchString ? availableFilters.filter(searchFilter) : availableFilters;

		var popoutList = filteredFilters.map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}
			var filterIsActive = activeFilterPaths.length && (activeFilterPaths.indexOf(el.field.path) > -1);
			return (
				<PopoutList.Item
					key={'item_' + el.field.path}
					icon={filterIsActive ? 'check' : 'chevron-right'}
					iconHover={filterIsActive ? 'check' : 'chevron-right'}
					isSelected={!!filterIsActive}
					label={el.field.label}
					onClick={() => { this.selectField(el.field); }} />
			);
		});

		return (
			<Popout.Pane onLayout={this.setPopoutHeight} key="list">
				<Popout.Body>
					<FormField style={{ borderBottom: '1px dashed rgba(0,0,0,0.1)', paddingBottom: '1em' }}>
						<FormInput ref="search" value={this.state.searchString} onChange={this.updateSearch} placeholder="Find a filter..." />
					</FormField>
					{popoutList}
				</Popout.Body>
			</Popout.Pane>
		);
	},
	renderForm () {
		return (
			<Popout.Pane onLayout={this.setPopoutHeight} key="form">
				<ListFiltersAddForm field={this.state.selectedField} onApply={this.applyFilter} onCancel={this.closePopout} onBack={this.navigateBack} maxHeight={this.props.maxHeight} />
			</Popout.Pane>
		);
	},
	render () {
		let { selectedField } = this.state;
		let popoutBodyStyle = this.state.innerHeight ? { height: this.state.innerHeight } : null;
		let popoutPanesClassname = classnames('Popout__panes', {
			'Popout__scrollable-area': !selectedField
		});

		return (
			<InputGroup.Section className={this.props.className}>
				<Button id="listHeaderFilterButton" isActive={this.state.isOpen} onClick={this.state.isOpen ? this.closePopout : this.openPopout}>
					<span className={this.props.className + '__icon octicon octicon-eye'} />
					<span className={this.props.className + '__label'}>Filter</span>
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={this.closePopout} relativeToID="listHeaderFilterButton">
					<Popout.Header
						leftAction={selectedField ? this.navigateBack : null}
						leftIcon={selectedField ? 'chevron-left' : null}
						title={selectedField ? selectedField.label : 'Filter'}
						transitionDirection={!!selectedField ? 'next' : 'prev'} />
					<Transition style={popoutBodyStyle} className={popoutPanesClassname} transitionName={!!selectedField ? 'Popout__pane-next' : 'Popout__pane-prev'} component="div">
						{selectedField ? this.renderForm() : this.renderList()}
					</Transition>
				</Popout>
			</InputGroup.Section>
		);
	}
});

module.exports = ListFiltersAdd;
