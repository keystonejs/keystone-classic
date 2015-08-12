var React = require('react');
var Transition = React.addons.CSSTransitionGroup;

var CurrentListStore = require('../stores/CurrentListStore');

var { Button, Checkbox, InputGroup, SegmentedControl } = require('elemental');

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
	
	getDefaultProps: function() {
		return {
			columns: null,
			isOpen: false,
		};
	},
	
	getInitialState: function() {
		return {
			format: FORMAT_OPTIONS[0].value,
			isOpen: false,
			useCurrentColumns: true,
		};
		
	},
	
	togglePopout: function(visible) {
		this.setState({
			isOpen: visible
		});
	},

	changeFormat (value) {
		this.setState({
			format: value
		});
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
		
		let checkboxStyle = { float: 'left', overflow: 'hidden', textOverflow: 'ellipsis', width: '50%', whiteSpace: 'nowrap' };
		let possibleColumns = CurrentListStore.getAvailableColumns().map(opt => <Checkbox label={opt.label} style={checkboxStyle} />);
		
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
					<div className="popout__body popout__scrollable-area">
						<SegmentedControl equalWidthSegments type="primary" options={FORMAT_OPTIONS} value={this.state.format} onChange={this.changeFormat} />
						<Checkbox label="Use the current columns" onChange={() => this.setState({useCurrentColumns:!useCurrentColumns})} checked={useCurrentColumns} />
						{this.renderColumnSelect()}
					</div>
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
	
	render: function() {
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
