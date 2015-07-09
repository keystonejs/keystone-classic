var React = require('react');
var classNames = require('classnames');

var { Button, FormField, FormInput } = require('elemental');

var ListHeader = React.createClass({
	
	displayName: 'ListFiltersAddForm',
	
	propTypes: {
		onApply: React.PropTypes.func,
		onCancel: React.PropTypes.func
	},
	
	getInitialState () {
		return {
			selectedToggle: this.props.selectedToggleOption
		};
	},
	componentDidMount () {
		React.findDOMNode(this.refs.input).focus();
	},

	handleToggleSelect (toggle) {
		this.setState({
			selectedToggle: toggle
		});
		React.findDOMNode(this.refs.input).focus();
	},
	handleFormSubmit (e) {
		e.preventDefault();
		this.props.onApply();
	},

	renderToggle () {
		var self = this;
		var toggleItems = this.props.toggleOptions.map(function(opt, i) {
			var className = classNames('popout__toggle__action', { 'is-selected': opt === self.state.selectedToggle });
			return (
				<span key={'i__' + i} className="popout__toggle__item">
					<button type="button" onClick={self.handleToggleSelect.bind(self, opt)} className={className}>{opt}</button>
				</span>
			);
		});

		return <div className="popout__toggle">{toggleItems}</div>;
	},
	
	render () {
		return (
			<form onSubmit={this.handleFormSubmit} className="ListFiltersForm">
				<div className="ListFiltersForm__header">
					<button type="button" className="ListFiltersForm__header__icon octicon octicon-chevron-left" onClick={this.props.onBack} />
					<span className="ListFiltersForm__header__label">{this.props.filterName}</span>
				</div>
				<div className="ListFiltersForm__body">
					{this.renderToggle()}
					{/*
						If text field
						<FormField>
							<label>
								<input type="checkbox" />
								<span> Inverted</span>
							</label>
						</FormField>
					*/}
					<FormField>
						<FormInput ref="input" placeholder="Text" />
					</FormField>
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