import React, { Component, PropTypes } from 'react';

/*
	Expose internal ref to parent
	=============================

	Field.create({
		triggerFileBrowser () {
			this.refs.fileInput.clickDomNode();
		},
		render () {
			<HiddenFileInput ref="fileInput" />
		}
	});
*/

class HiddenFileInput extends Component {
	constructor () {
		super();

		this.clearValue = this.clearValue.bind(this);
		this.clickDomNode = this.clickDomNode.bind(this);
		this.hasValue = this.hasValue.bind(this);
	}
	clearValue () {
		this.target.value = '';
	}
	clickDomNode () {
		this.target.click();
	}
	hasValue () {
		return !!this.target.value;
	}
	render () {
		const { style, ...props } = this.props;
		const setRef = (n) => (this.target = n);
		const styles = {
			left: -9999,
			position: 'absolute',
			...style,
		};

		return (
			<input
				{...props}
				style={styles}
				ref={setRef}
				tabIndex="-1"
				type="file"
			/>
		);
	}
};

HiddenFileInput.propTypes = {
	onChange: PropTypes.func.isRequired,
};

module.exports = HiddenFileInput;
