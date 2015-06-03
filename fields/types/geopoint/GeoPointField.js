var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	displayName: 'GeopointField',

	focusTargetRef: 'lat',
	
	valueChanged: function(which, event) {
		this.props.value[which] = event.target.value;
		this.props.onChange({
			path: this.props.path,
			value: this.props.value
		});
	},
	
	renderValue: function() {
		if (this.props.value[1] && this.props.value[0]) {
			return <div className="field-value">{this.props.value[1]}, {this.props.value[0]}</div>;//eslint-disable-line comma-spacing
		}
		return <div className="field-value">(not set)</div>;
	},
	
	renderField: function() {
		return (
			<div className="form-row">
				<div className="col-sm-6">
					<input type="text" name={this.props.path + '[1]'} placeholder="Latitude" ref="lat" value={this.props.value[1]} onChange={this.valueChanged.bind(this, 1)} autoComplete="off" className="form-control" />
				</div>
				<div className="col-sm-6">
					<input type="text" name={this.props.path + '[0]'} placeholder="Longitude" ref="lng" value={this.props.value[0]} onChange={this.valueChanged.bind(this, 0)} autoComplete="off" className="form-control" />
				</div>
			</div>
		);
	}
	
});
