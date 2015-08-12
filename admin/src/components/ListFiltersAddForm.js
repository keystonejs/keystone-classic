var React = require('react');
var classNames = require('classnames');

var filters = require('../filters');

var { Button } = require('elemental');

var ListFiltersAddForm = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired,
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func
	},

	getInitialState () {
		var filterComponent = filters[this.props.field.type];
		var filterValue = filterComponent && filterComponent.getDefaultValue ? filterComponent.getDefaultValue() : {};
		return {
			filterComponent: filterComponent,
			filterValue: filterValue
		};
	},
	
	updateValue (filterValue) {
		this.setState({
			filterValue: filterValue
		});
	},

	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply(this.state.filterValue);
	},

	renderInvalidFilter () {
		return (
			<div>Error: type {this.props.field.type} has no filter UI.</div>
		);
	},

	render () {
		var FilterComponent = this.state.filterComponent;
		return (
			<form onSubmit={this.handleFormSubmit}>
				<div className="popout__body">
					{FilterComponent ? <FilterComponent field={this.props.field} filter={this.state.filterValue} onChange={this.updateValue} /> : this.renderInvalidFilter()}
				</div>
				<div className="popout__footer">
					<Button type="link" className="popout__footer-button popout__footer-button--apply" submit>Apply</Button>
					<Button onClick={this.closePopout} type="link-cancel" className="popout__footer-button popout__footer-button--cancel">Cancel</Button>
				</div>
			</form>
		);
	}

});

module.exports = ListFiltersAddForm;
