import _ from 'lodash';
import CodeMirror from 'codemirror';
import Field from '../Field';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { FormInput } from '../../../admin/client/App/elemental';
import classnames from 'classnames';

/**
 * TODO:
 * - Remove dependency on lodash
 */

// See CodeMirror docs for API:
// http://codemirror.net/doc/manual.html

module.exports = Field.create({
	displayName: 'CodeField',
	statics: {
		type: 'Code',
	},

	getInitialState () {
		return {
			isFocused: false,
		};
	},
	componentDidMount () {
		if (!this.refs.codemirror) {
			return;
		}

		var options = _.defaults({}, this.props.editor, {
			lineNumbers: true,
			readOnly: this.shouldRenderField() ? false : true,
		});

		this.codeMirror = CodeMirror.fromTextArea(findDOMNode(this.refs.codemirror), options);
		this.codeMirror.setSize(null, this.props.height);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this._currentCodemirrorValue = this.props.value;
	},
	componentWillUnmount () {
		// todo: is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},
	componentWillReceiveProps (nextProps) {
		if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
	},
	focus () {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	},
	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
	},
	codemirrorValueChanged (doc, change) {
		var newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		this.props.onChange({
			path: this.props.path,
			value: newValue,
		});
	},
	renderCodemirror () {
		const className = classnames('CodeMirror-container', {
			'is-focused': this.state.isFocused && this.shouldRenderField(),
		});

		return (
			<div className={className}>
				<FormInput
					autoComplete="off"
					multiline
					name={this.getInputName(this.props.path)}
					onChange={this.valueChanged}
					ref="codemirror"
					value={this.props.value}
				/>
			</div>
		);
	},
	renderValue () {
		return this.renderCodemirror();
	},
	renderField () {
		return this.renderCodemirror();
	},
});
