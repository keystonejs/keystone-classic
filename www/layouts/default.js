import React from 'react';

class DefaultLayout extends React.Component {
	render () {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export default DefaultLayout;
