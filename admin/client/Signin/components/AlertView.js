import React from 'react';
import { Alert} from 'elemental';

var AlertView = React.createClass({
	render: function(){
		if (this.props.isInvalid) {
			return <Alert key="error" type="danger" style={{ textAlign: 'center' }}>{this.props.invalidMessage}</Alert>;
		} else if (this.props.signedOut) {
			return <Alert key="signed-out" type="info" style={{ textAlign: 'center' }}>You have been signed out.</Alert>;
		} else {
			/* eslint-disable react/self-closing-comp */
			// TODO: This probably isn't the best way to do this, we
			// shouldn't be using Elemental classNames instead of components
			return <div key="fake" className="Alert Alert--placeholder">&nbsp;</div>;
			/* eslint-enable */
		}
	}
});

module.exports = AlertView;