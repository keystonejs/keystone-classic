var classnames = require('classnames');
var React = require('react');
var Transition = React.addons.CSSTransitionGroup;

var CurrentListStore = require('../stores/CurrentListStore');
var { Button, Checkbox, InputGroup, SegmentedControl } = require('elemental');

const ESC_KEYCODE = 27;

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
	
	componentDidMount: function() {
		window.addEventListener('keydown', this.handleKeyDown);
	},
	
	componentWillUnMount: function() {
		window.removeEventListener('keydown', this.handleKeyDown);
	},
	
	handleKeyDown (e) {
		if ( e.keyCode == ESC_KEYCODE ) {
			this.togglePopout(false);
		}
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
		// console.log(column, value);
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
	
	handleFormSubmit (e) {
		e.preventDefault();
		
		console.info(`Set list columns:`, Object.keys(this.state.selectedColumns));
		this.togglePopout(false);
	},

	renderButton () {
		return (
			<Button onClick={this.togglePopout.bind(this, !this.state.isOpen)}>
				Columns
				<span className="disclosure-arrow" />
			</Button>
		);
	},
	
	renderColumnSelect () {
		let possibleColumns = this.getListUIElements().map((el, i) => {
			if (el.type === 'heading') {
				return <div key={'item-' + i} className="popout__list__header">{el.content}</div>
			}
			
			let columnKey = el.field.path;
			let columnValue = this.state.selectedColumns[columnKey];
			
			var itemClassname = classnames('popout__list__item', {
				'is-selected': columnValue
			});
			var iconClassname = classnames('popout__list__item__icon octicon',
				columnValue ? 'octicon-check' : 'octicon-dash'
			);
			
			return (
				<button type="button" key={'item-' + el.field.path} onClick={this.toggleColumn.bind(this, columnKey, !columnValue)} title={el.field.label} className={itemClassname}>
					<span className={iconClassname} />
					{el.field.label}
				</button>
			);
		});
		
		return possibleColumns;
	},

	renderPopout () {
		if (!this.state.isOpen) return;
		
		let { useCurrentColumns } = this.state;
		
		return (
			<div className="popout">
				<span className="popout-arrow" />
				<form onSubmit={this.handleFormSubmit} className="popout-inner">
					<div className="popout__header">
						<span className="popout__header__label">Columns</span>
					</div>
					<div className="popout__body popout__scrollable-area">
						{this.renderColumnSelect()}
					</div>
					<div className="popout__footer">
						<Button type="link" className="popout__footer-button popout__footer-button--apply" submit>Apply</Button>
						<Button onClick={this.togglePopout.bind(this, false)} type="link-cancel" className="popout__footer-button popout__footer-button--cancel">Cancel</Button>
					</div>
				</form>
			</div>
		);
	},

	renderBlockout () {
		if (!this.state.isOpen) return;
		return <div className="blockout" onClick={this.togglePopout.bind(this, false)} />;
	},
	
	render () {
		let { list } = this.props;
		let { useCurrentColumns } = this.state;
		
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

module.exports = ListDownloadForm;
