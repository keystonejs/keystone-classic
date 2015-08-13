var classnames = require('classnames');
var React = require('react');
var Transition = React.addons.CSSTransitionGroup;

var CurrentListStore = require('../stores/CurrentListStore');

var { Button, Checkbox, Form, FormField, InputGroup, SegmentedControl } = require('elemental');

const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

var ListDownloadForm = React.createClass({
	displayName: 'ListDownloadForm',
	propTypes: {
		columns: React.PropTypes.array,
		isOpen: React.PropTypes.string,
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
	
	handleFormSubmit (e) {
		e.preventDefault();
		
		console.info(`Download ${this.state.format.toUpperCase()} with columns:`, Object.keys(this.state.selectedColumns));
		this.togglePopout(false);
	},

	renderButton () {
		return (
			<Button onClick={this.togglePopout.bind(this, true)}>
				Download
				<span className="disclosure-arrow" />
			</Button>
		);
	},
	
	renderColumnSelect () {
		if (this.state.useCurrentColumns) return null;
		
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
		
		return (
			<div style={{ borderTop: '1px dashed #eee', marginTop: '1em', paddingTop: '1em' }}>
				{possibleColumns}
			</div>
		);
	},

	renderPopout () {
		if (!this.state.isOpen) return;
		
		let { useCurrentColumns } = this.state;
		
		return (
			<div className="popout">
				<span className="popout-arrow" />
				<form onSubmit={this.handleFormSubmit} className="popout-inner">
					<div className="popout__header">
						<span className="popout__header__label">Download</span>
					</div>
					<Form type="horizontal" className="popout__body popout__scrollable-area" component="div">
						<FormField label="File format:">
							<SegmentedControl equalWidthSegments options={FORMAT_OPTIONS} value={this.state.format} onChange={this.changeFormat} />
						</FormField>
						<FormField label="Columns:">
							<Checkbox label="Use currently selected" onChange={() => this.setState({useCurrentColumns:!useCurrentColumns})} checked={useCurrentColumns} />
						</FormField>
						{this.renderColumnSelect()}
					</Form>
					<div className="popout__footer">
						<Button type="link" className="popout__footer-button popout__footer-button--apply" submit>Download</Button>
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
