import React, { Component, PropTypes } from 'react';
import theme from '../../../theme';

// Using window.innerWidth and state instead of CSS media breakpoints
// because we want to render null rather than an empty span. Allowing for
// CSS pseudo classes like :only-child to behave as expected.

// Return true if window + document
const canUseDOM = !!(
	typeof window !== 'undefined'
	&& window.document
	&& window.document.createElement
);

class ResponsiveText extends Component {
	constructor () {
		super();
		this.handleResize = this.handleResize.bind(this);
		this.state = {
			windowWidth: canUseDOM ? window.innerWidth : 0,
		};
	}
	componentDidMount () {
		if (canUseDOM) {
			window.addEventListener('resize', this.handleResize);
			this.handleResize();
		}
	}
	componentWillUnmount () {
		if (canUseDOM) {
			window.removeEventListener('resize', this.handleResize);
		}
	}
	handleResize () {
		this.setState({
			windowWidth: canUseDOM ? window.innerWidth : 0,
		});
	}
	render () {
		const {
			component: Component,
			hiddenLG,
			hiddenMD,
			hiddenSM,
			hiddenXS,
			visibleLG,
			visibleMD,
			visibleSM,
			visibleXS,
			...props
		} = this.props;
		const { windowWidth } = this.state;

		let text;

		// set text value from breakpoint; attempt XS --> LG
		if (windowWidth < theme.breakpointNumeric.mobile) {
			text = visibleXS || hiddenSM || hiddenMD || hiddenLG;
		} else if (windowWidth < theme.breakpointNumeric.tabletPortrait) {
			text = hiddenXS || visibleSM || hiddenMD || hiddenLG;
		} else if (windowWidth < theme.breakpointNumeric.tabletLandscape) {
			text = hiddenXS || hiddenSM || visibleMD || hiddenLG;
		} else {
			text = hiddenXS || hiddenSM || hiddenMD || visibleLG;
		}

		return text ? <Component {...props}>{text}</Component> : null;
	}
};

ResponsiveText.propTypes = {
	hiddenLG: PropTypes.string,
	hiddenMD: PropTypes.string,
	hiddenSM: PropTypes.string,
	hiddenXS: PropTypes.string,
	visibleLG: PropTypes.string,
	visibleMD: PropTypes.string,
	visibleSM: PropTypes.string,
	visibleXS: PropTypes.string,
};
ResponsiveText.defaultProps = {
	component: 'span',
};

module.exports = ResponsiveText;
