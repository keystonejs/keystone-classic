import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

var PopoutListItem = React.createClass({
	displayName: 'PopoutListItem',
	propTypes: {
		icon: React.PropTypes.string,
		iconHover: React.PropTypes.string,
		isSelected: React.PropTypes.bool,
		label: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
	},
	getInitialState () {
		return {
			hover: false
		};
	},
	hover () {
		this.setState({ hover: true });
	},
	unhover () {
		this.setState({ hover: false });
	},
	renderIcon () {
		if (!this.props.icon) return null;
		let icon = this.state.hover && this.props.iconHover ? this.props.iconHover : this.props.icon;
		let iconClassname = classnames('PopoutList__item__icon octicon', ('octicon-' + icon));

		return <span className={iconClassname} />;
	},
	render () {
		let itemClassname = classnames('PopoutList__item', {
			'is-selected': this.props.isSelected
		});
		let props = blacklist(this.props, 'className', 'icon', 'isSelected', 'label');
		return (
			<button
				type="button"
				title={this.props.label}
				className={itemClassname}
				onFocus={this.hover}
				onBlur={this.unhover}
				onMouseOver={this.hover}
				onMouseOut={this.unhover}
				{...props}
				>
				{this.renderIcon()}
				<span className="PopoutList__item__label">{this.props.label}</span>
			</button>
		);
	},
});

module.exports = PopoutListItem;
