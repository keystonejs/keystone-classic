var SelectField = require('../SelectField'),
	React = require('react');

module.exports = function() {
	console.log(this.state);

	return <this.components.Form>
		<h1>Select Field</h1>

		<h2>Default</h2>

      	<SelectField label={this.state.fieldHasLabel ? "Label" : null} value={this.state.fieldValue} disabled={this.state.fieldIsDisabled} noedit={this.state.fieldIsReadOnly} />

		<this.components.SetField form={this} />
		<this.components.ModifyButtons form={this} />

		<h2>Default value</h2>

		<h2>Pre-set value</h2>
	</this.components.Form>;
};
