var React = require('react');
var Transition = React.addons.CSSTransitionGroup;
var blacklist = require('blacklist');
var classNames = require('classnames');
var utils = require('keystone-utils');

var ListFiltersAddForm = require('./ListFiltersAddForm');

var Button = require('elemental').Button;
var Dropdown = require('elemental').Dropdown;
var FormInput = require('elemental').FormInput;
var InputGroup = require('elemental').InputGroup;
var Tag = require('elemental').Tag;

// const TOGGLE_OPTIONS = ['Contains', 'Exactly']; // Text
const TOGGLE_OPTIONS = ['Linked To', 'NOT Linked To']; // Relationship
// const TOGGLE_OPTIONS = ['Checked', 'NOT Checked']; // Boolean
// const TOGGLE_OPTIONS = ['Exactly', 'Greater Than', 'Less Than', 'Between']; // Number
// const TOGGLE_OPTIONS = ['On', 'After', 'Before', 'Between']; // Date

const COLUMNS = Keystone.list.uiElements.map(function(col,i) {
	return {
		type:  col.type === 'heading' ? 'header' : 'item',
		label: col.type === 'heading' ? col.content : utils.titlecase(col.field)
	}
});

var HeightDetektor = React.createClass({
	componentDidMount () {
		console.log("Detected height: " + this.getDOMNode().offsetHeight);
		this.props.onLayout && this.props.onLayout(this.getDOMNode().offsetHeight);
	},
	render () {
		var props = blacklist(this.props, 'onLayout', 'children');
		return <div {...props}>{this.props.children}</div>
	}
});

var ListFiltersAdd = React.createClass({
	
	displayName: 'ListFiltersAdd',

	getDefaultProps: function() {
		return {
			maxHeight: 360
		};
	},
	getInitialState: function() {
		return {
			isOpen: false,
			selectedFilter: false,
			innerHeight: 0
		};
	},

	openPopout: function() {
		this.setState({ isOpen: true });
	},
	closePopout: function() {
		this.setState({ isOpen: false, selectedFilter: false, innerHeight: 0 });
	},
	setPopoutHeight: function(height) {
		this.setState({ innerHeight: Math.min(this.props.maxHeight, height) });
	},

	handleFilterRemove: function(filter) {
		this.setState({
			selectedFilter: false
		});
	},

	handleFilterSelect: function(filter) {
		this.setState({
			selectedFilter: filter
		});
	},

	renderButton: function() {
		return (
			<Button ref="addFilterButton" type="primary" onClick={this.state.isOpen ? this.closePopout : this.openPopout}>Add Filter</Button>
		);
	},
	renderList: function() {
		var self = this;
		// if (this.state.selectedFilter) return;

		var popoutList = COLUMNS.map(function(item, i) {
			var menuItem;
			var itemClass = classNames('popout__list__item', {
				'is-selected': item.type === 'item' && i < 1
			});
			var iconClass = classNames('popout__list__item__icon octicon',
				(item.type === 'item' && i < 1) ? 'octicon-check' : 'octicon-chevron-right'
			);
			if (item.type === 'header') {
				menuItem = <div key={'item-' + i} className="popout__list__header">{item.label}</div>
			} else if (item.type === 'divider') {
				menuItem = <div key={'item-' + i} className="popout__list__divider" />
			} else {
				menuItem = (
					<button key={'item-' + i} onClick={self.handleFilterSelect.bind(self, item.label)} title={item.label} className={itemClass}>
						<span className={iconClass} />
						{item.label}
					</button>
				);
			}
			return menuItem;
		}.bind(this));

		return (
			<HeightDetektor onLayout={this.setPopoutHeight} key="list" className="popout__list popout-pane" component="div">
				{popoutList}
			</HeightDetektor>
		);
	},
	renderForm: function() {
		return (
			<HeightDetektor onLayout={this.setPopoutHeight} key="form" className="popout-pane">
				<ListFiltersAddForm filterName={this.state.selectedFilter} toggleOptions={TOGGLE_OPTIONS} selectedToggleOption={TOGGLE_OPTIONS[0]} onApply={this.closePopout} onCancel={this.closePopout} onBack={this.handleFilterRemove} />
			</HeightDetektor>
		);
	},
	renderPopout: function() {
		if (!this.state.isOpen) return;
		var height = this.state.innerHeight ? { height: this.state.innerHeight } : null;
		return (
			<div className="popout">
				<span className="popout-arrow" />
				<Transition style={height} className="popout-inner" transitionName={!!this.state.selectedFilter ? 'popout-pane-next' : 'popout-pane-prev'} component="div">
					{this.state.selectedFilter ? this.renderForm() : this.renderList()}
				</Transition>
			</div>
		);
	},
	renderBlockout: function() {
		if (!this.state.isOpen) return;
		return <div className="blockout" onClick={this.closePopout} />;
	},
	
	render: function() {
		var style = { display: 'inline-block', marginLeft: '.5em', marginRight: '.5em', position: 'relative' };
		return (
			<InputGroup.Section>
				{this.renderButton()}
				<Transition className="popout-wrapper" transitionName="popout" component="div">
					{this.renderPopout()}
				</Transition>
				{this.renderBlockout()}
			</InputGroup.Section>
		);
	}
	
});

module.exports = ListFiltersAdd;