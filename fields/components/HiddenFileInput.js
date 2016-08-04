import React, { Component, PropTypes } from 'react';

class HiddenFileInput extends Component {
	constructor () {
		super();

		this.clickDomNode = this.clickDomNode.bind(this);
	}
	clickDomNode () {
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

		this.target.click();
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
