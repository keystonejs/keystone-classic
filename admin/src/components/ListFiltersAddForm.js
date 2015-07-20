var React = require('react');
var classNames = require('classnames');

var filters = require('../filters');

var { Button } = require('elemental');

var ListHeader = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired,
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func
	},

	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply();
	},

	renderInvalidFilter () {
		return (
			<div>Error: type {this.props.field.type} has no filter UI yet.</div>
		);
	},

	render () {
		var TypeFilter = filters[this.props.field.type];
		return (
			<form onSubmit={this.handleFormSubmit} className="ListFiltersForm">
				<div className="ListFiltersForm__header">
					<button type="button" className="ListFiltersForm__header__icon octicon octicon-chevron-left" onClick={this.props.onBack} />
					<span className="ListFiltersForm__header__label">{this.props.field.label}</span>
				</div>
				<div className="ListFiltersForm__body">
					{TypeFilter ? <TypeFilter field={this.props.field} /> : this.renderInvalidFilter()}
				</div>
				<div className="ListFiltersForm__footer">
					<Button onClick={this.props.onApply} type="link" className="ListFiltersForm__footer-button ListFiltersForm__footer-button--apply" submit>Apply</Button>
					<Button onClick={this.props.onCancel} type="link-cancel" className="ListFiltersForm__footer-button ListFiltersForm__footer-button--cancel">Cancel</Button>
				</div>
			</form>
		);
	}

});

module.exports = ListHeader;
