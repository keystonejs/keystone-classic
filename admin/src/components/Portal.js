import React from 'react';
module.exports = React.createClass({
	displayName: 'Portal',
	portalElement: null,
	render: () => null,
	componentDidMount() {
		let p = document.createElement('div');
		document.body.appendChild(p);
		this.portalElement = p;
		this.componentDidUpdate();
	},
	componentWillUnmount() {
		document.body.removeChild(this.portalElement);
	},
	componentDidUpdate() {
		React.render(<div {...this.props}>{this.props.children}</div>, this.portalElement);
	}
});
