/**
 * Used by the Popout component and the Lightbox component of the fields for
 * popouts. Renders a non-react DOM node.
 */

import React from 'react';
import ReactDOM from 'react-dom';

module.exports = React.createClass({
	displayName: 'Portal',
	portalElement: null, // eslint-disable-line react/sort-comp
	componentDidMount () {
		const el = document.createElement('div');
		document.body.appendChild(el);
		this.portalElement = el;
		this.componentDidUpdate();
	},
	componentWillUnmount () {
		document.body.removeChild(this.portalElement);
	},
	componentDidUpdate () {
		ReactDOM.render(<div {...this.props} />, this.portalElement);
	},
	getPortalDOMNode () {
		return this.portalElement;
	},
	render () {
		return null;
	},
});
