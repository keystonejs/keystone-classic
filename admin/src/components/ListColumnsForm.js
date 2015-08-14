var classnames = require('classnames');
var React = require('react');
var Transition = React.addons.CSSTransitionGroup;

var CurrentListStore = require('../stores/CurrentListStore');
var Popout = require('./Popout');
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
				return <div key={'item-' + i} className="Popout__list__header">{el.content}</div>
			}
			
			let columnKey = el.field.path;
			let columnValue = this.state.selectedColumns[columnKey];
			
			var itemClassname = classnames('Popout__list__item', {
				'is-selected': columnValue
			});
			var iconClassname = classnames('Popout__list__item__icon octicon',
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
	
	render () {
		let { list } = this.props;
		let { useCurrentColumns } = this.state;
		
		return (
			<InputGroup.Section>
				<Button onClick={this.togglePopout.bind(this, !this.state.isOpen)}>
					Columns
					<span className="disclosure-arrow" />
				</Button>
				<Popout isOpen={this.state.isOpen} onCancel={this.togglePopout.bind(this, !this.state.isOpen)}>
					<Popout.Header title="Columns" />
					<Popout.Body>
						{this.renderColumnSelect()}
					</Popout.Body>
					<Popout.Footer 
						primaryButtonAction={this.applyColumns}
						primaryButtonLabel="Apply"
						secondaryButtonAction={this.togglePopout.bind(this, !this.state.isOpen)}
						secondaryButtonLabel="Cancel" />
				</Popout>
			</InputGroup.Section>
		);
	}
	
});

module.exports = ListDownloadForm;
