import { Children, Component, PropTypes } from 'react';

import { STYLED_COMPONENTS_CONTEXT_CHANNEL } from '../../../constants';

// Pass the Lightbox context through to the Portal's descendents
// StackOverflow discussion http://goo.gl/oclrJ9

class PassContext extends Component {
	getChildContext () {
		return this.props.context;
	}
	render () {
		return Children.only(this.props.children);
	}
};

PassContext.propTypes = {
	context: PropTypes.object.isRequired,
};
PassContext.childContextTypes = {
	onClose: PropTypes.func,
	[STYLED_COMPONENTS_CONTEXT_CHANNEL]: PropTypes.func,
};

export default PassContext;
