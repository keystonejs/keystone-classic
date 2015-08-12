var React = require('react');

var CurrentListStore = require('../stores/CurrentListStore');

var { Alert, Button, Checkbox, Form, FormField, Modal, SegmentedControl } = require('elemental');

const FORMAT_OPTIONS = [
	{ label: 'CSV', value: 'csv' },
	{ label: 'JSON', value: 'json' },
];

var DownloadForm = React.createClass({
	displayName: 'DownloadForm',
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
			useCurrentColumns: true,
		};
		
	},

	changeFormat (value) {
		this.setState({
			format: value
		});
	},
	
	renderColumnSelect () {
		if (this.state.useCurrentColumns) return null;
		
		let possibleColumns = CurrentListStore.getAvailableColumns().map(opt => <Checkbox label={opt.label} style={{ float: 'left', width: '50%' }} />);
		
		return (
			<div style={{ borderTop: '1px dashed #eee', marginTop: '1em', paddingTop: '1em' }}>
				{possibleColumns}
			</div>
		);
	},
	
	render: function() {
		let { list } = this.props;
		let { useCurrentColumns } = this.state;
		
		return (
			<Modal isOpen={this.props.isOpen} onCancel={this.props.onCancel} backdropClosesModal>
				<Form type="horizontal" encType="multipart/form-data" method="post">
					<Modal.Header text="Download" onClose={this.props.onCancel} showCloseButton />
					<Modal.Body>
						<FormField label="Format">
							<div style={{ width: '50%' }}>
								<SegmentedControl equalWidthSegments type="primary" options={FORMAT_OPTIONS} value={this.state.format} onChange={this.changeFormat} />
							</div>
						</FormField>
						<FormField label="Columns">
							<Checkbox label="Use the current columns" onChange={() => this.setState({useCurrentColumns:!useCurrentColumns})} checked={useCurrentColumns} />
							{this.renderColumnSelect()}
						</FormField>
					</Modal.Body>
					<Modal.Footer>
						<Button type="success" submit>Download</Button>
						<Button type="link-cancel" onClick={this.props.onCancel}>Cancel</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
	
});

module.exports = DownloadForm;
