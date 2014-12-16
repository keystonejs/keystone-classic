var React      = require('react'),
	Field      = require('../field'),
	Note       = require('../../components/note'),
	CodeMirror = require('codemirror');

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html

// TODO:
// Bring forward mime-type language support and features (needs review)

module.exports = Field.create({
	
	componentDidMount: function() {
		if (this.refs.codemirror) {
			var options = {
				lineNumbers: true
			};
			this.codeMirror = CodeMirror.fromTextArea(this.refs.codemirror.getDOMNode(), options);
			this.codeMirror.on('change', this.codemirrorValueChanged);
			this._currentCodemirrorValue = this.props.value;
		}
	},
	
	componentWillUnmount: function() {
		// todo: is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},
	
	componentWillReceiveProps: function(nextProps) {
		if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
	},
	
	codemirrorValueChanged: function(doc, change) {
		var newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		this.props.onChange({
			path: this.props.path,
			value: newValue
		});
	},
	
	renderField: function() {
		return <textarea ref="codemirror" name={this.props.path} value={this.props.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />;
	}
	
});
