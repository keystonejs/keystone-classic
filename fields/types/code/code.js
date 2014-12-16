var React      = require('react'),
	Field      = require('../field'),
	Note       = require('../../components/note'),
	CodeMirror = require('codemirror');

module.exports = Field.create({
	componentDidMount: function() {
		if (this.refs.textField) {
			CodeMirror.fromTextArea(this.refs.textField.getDOMNode(), {
				lineNumbers: true
			});
		}
	},

	renderUI: function() {
		var value = this.props.value;

		var field;
		if (this.props.noedit) {
			field = <div className="field-value">{this.props.value}</div>;
		} else {
			field = <textarea ref="textField" name={this.props.path}>{this.props.value}</textarea>;
		}

		return <div className='field type-code'>
			<label className='field-label'>{this.props.label}</label>
			<div className='field-ui'>{field}</div>
			<Note note={this.props.note} />
		</div>;
	}
});
