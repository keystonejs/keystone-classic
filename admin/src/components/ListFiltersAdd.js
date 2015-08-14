var React = require('react');
var Transition = React.addons.CSSTransitionGroup;
var blacklist = require('blacklist');
var classNames = require('classnames');
var utils = require('../utils.js');

var CurrentListStore = require('../stores/CurrentListStore');

var HeightDetector = require('./HeightDetector');
var ListFiltersAddForm = require('./ListFiltersAddForm');
var Popout = require('./Popout');
var PopoutList = require('./PopoutList');

var { Button, InputGroup } = require('elemental');

function pluck(arr, key) {
	return arr.map(obj => obj[key]);
}

const ESC_KEYCODE = 27;

var ListFiltersAdd = React.createClass({

	displayName: 'ListFiltersAdd',

	getDefaultProps () {
		return {
			maxHeight: 360
		};
	},

	getInitialState () {
		return this.getStateFromStore();
	},
	
	componentDidMount: function() {
		window.addEventListener('keydown', this.handleKeyDown);
	},
	
	componentWillUnMount: function() {
		window.removeEventListener('keydown', this.handleKeyDown);
	},
	
	handleKeyDown (e) {
		if ( e.keyCode == ESC_KEYCODE ) {
			this.closePopout();
		}
	},
	
	getStateFromStore () {
		return {
			activeFilters: CurrentListStore.getActiveFilters(),
			innerHeight: 0,
			isOpen: false,
			selectedField: false,
		};
	},

	openPopout () {
		this.setState({ isOpen: true });
	},

	closePopout () {
		this.setState({ isOpen: false, selectedField: false, innerHeight: 0 });
	},

	setPopoutHeight (height) {
		this.setState({ innerHeight: Math.min(this.props.maxHeight, height) });
	},

	navigateBack () {
		this.setState({
			selectedField: false
		});
	},

	selectField (field) {
		this.setState({
			selectedField: field
		});
	},

	applyFilter (value) {
		console.info('Applying filter:', this.state.selectedField.path, value);
		CurrentListStore.addFilter({
			field: this.state.selectedField,
			value: value
		});
		this.closePopout();
	},

	getListUIElements () {
		return Keystone.list.uiElements.map((el) => {
			return el.type === 'field' ? {
				type: 'field',
				field: Keystone.list.fields[el.field]
			} : el;
		});
	},

	renderList () {
		let activeFilterFields = pluck(this.state.activeFilters, 'field');
		let activeFilterPaths = pluck(activeFilterFields, 'path');
		
		var popoutList = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.content}</PopoutList.Heading>;
			}
			
			var filterIsActive = activeFilterPaths.length && (activeFilterPaths.indexOf(el.field.path) > -1);
			
			return <PopoutList.Item
				key={'item_' + el.field.path}
				icon={filterIsActive ? 'check' : 'chevron-right'}
				isSelected={filterIsActive}
				label={el.field.label}
				onClick={() => { this.selectField(el.field) }} />;
		});

		return (
			<HeightDetector onLayout={this.setPopoutHeight} key="list" className="Popout__body Popout__pane" component="div">
				{popoutList}
			</HeightDetector>
		);
	},

	renderForm () {
		return (
			<HeightDetector onLayout={this.setPopoutHeight} key="form" className="Popout__pane">
				<ListFiltersAddForm field={this.state.selectedField} onApply={this.applyFilter} onCancel={this.closePopout} onBack={this.navigateBack} />
			</HeightDetector>
		);
	},

	render () {
		var popoutBodyStyle = this.state.innerHeight ? { height: this.state.innerHeight } : null;
		
		return (
			<InputGroup.Section>
				<Button isActive={this.state.isOpen} onClick={this.state.isOpen ? this.closePopout : this.openPopout}>
					Filters
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={this.closePopout}>
					<Popout.Header
						leftAction={this.state.selectedField ? this.navigateBack : null}
						leftIcon={this.state.selectedField ? 'chevron-left' : null}
						title={this.state.selectedField ? this.state.selectedField.label : 'Filter'}
						transitionDirection={!!this.state.selectedField ? 'next' : 'prev'} />
					<Transition style={popoutBodyStyle} className="Popout__scrollable-area" transitionName={!!this.state.selectedField ? 'Popout__pane-next' : 'Popout__pane-prev'} component="div">
						{this.state.selectedField ? this.renderForm() : this.renderList()}
					</Transition>
				</Popout>
			</InputGroup.Section>
		);
	}

});

module.exports = ListFiltersAdd;
