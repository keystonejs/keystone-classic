'use strict';

import React from 'react';

let ListTitle = React.createClass({
	propTypes: {
		count: React.PropTypes.string,
		href: React.PropTypes.string,
		label: React.PropTypes.string,
	},
	render () {
		return (
			<div className="dashboard-group__list">
				<span className="dashboard-group__list-inner">
					<a href={this.props.href} className="dashboard-group__list-tile">
						<div className="dashboard-group__list-label">{this.props.label}</div>
						<div className="dashboard-group__list-count">{this.props.count}</div>
					</a>
					<a href={this.props.href + '?create'} className="dashboard-group__list-create octicon octicon-plus" title="Create" tabIndex="-1" />
				</span>
			</div>
		);
	},
});

export default ListTitle;
