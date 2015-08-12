var React = require('react');
var Transition = React.addons.CSSTransitionGroup;
var blacklist = require('blacklist');
var classNames = require('classnames');
var utils = require('../utils.js');

var CurrentListStore = require('../stores/CurrentListStore');

var HeightDetector = require('./HeightDetector');
var ListFiltersAddForm = require('./ListFiltersAddForm');

var { Button, InputGroup } = require('elemental');

var ListFiltersAdd = React.createClass({

	displayName: 'ListFiltersAdd',

	getDefaultProps () {
		return {
			maxHeight: 360
		};
	},

	getInitialState () {
		return {
			isOpen: false,
			selectedField: false,
			innerHeight: 0
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
		CurrentListStore.addFilter({
			field: this.state.selectedField,
			value: value
		});
	},

	getListUIElements () {
		return Keystone.list.uiElements.map((el) => {
			return el.type === 'field' ? {
				type: 'field',
				field: Keystone.list.fields[el.field]
			} : el;
		});
	},

	renderButton () {
		return (
			<Button onClick={this.state.isOpen ? this.closePopout : this.openPopout}>
				Filters
				<span className="disclosure-arrow" />
			</Button>
		);
	},

	renderList () {
		var popoutList = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <div key={'item-' + i} className="popout__list__header">{el.content}</div>
			}
			var filterIsActive = i < 1; // TODO: Actually track filter values
			var itemClass = classNames('popout__list__item', {
				'is-selected': filterIsActive
			});
			var iconClass = classNames('popout__list__item__icon octicon',
				filterIsActive ? 'octicon-check' : 'octicon-chevron-right'
			);
			return (
				<button key={'item-' + el.field.path} onClick={() => { this.selectField(el.field) }} title={el.field.label} className={itemClass}>
					<span className={iconClass} />
					{el.field.label}
				</button>
			);
		});

		return (
			<HeightDetector onLayout={this.setPopoutHeight} key="list" className="popout__list popout-pane" component="div">
				{popoutList}
			</HeightDetector>
		);
	},

	renderForm () {
		return (
			<HeightDetector onLayout={this.setPopoutHeight} key="form" className="popout-pane">
				<ListFiltersAddForm field={this.state.selectedField} onApply={this.applyFilter} onCancel={this.closePopout} onBack={this.navigateBack} />
			</HeightDetector>
		);
	},

	renderPopout () {
		if (!this.state.isOpen) return;
		var height = this.state.innerHeight ? { height: this.state.innerHeight } : null;
		return (
			<div className="popout">
				<span className="popout-arrow" />
				<Transition style={height} className="popout-inner" transitionName={!!this.state.selectedField ? 'popout-pane-next' : 'popout-pane-prev'} component="div">
					{this.state.selectedField ? this.renderForm() : this.renderList()}
				</Transition>
			</div>
		);
	},

	renderBlockout () {
		if (!this.state.isOpen) return;
		return <div className="blockout" onClick={this.closePopout} />;
	},

	render () {
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
