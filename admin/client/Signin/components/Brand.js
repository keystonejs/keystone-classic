import React from 'react';


var Brand = React.createClass({
	render: function(){
		let logo = { src: `${Keystone.adminPath}/images/logo.png`, width: 205, height: 68 };
		if (this.props.logo) {
			logo = typeof this.props.logo === 'string' ? { src: this.props.logo } : this.props.logo;
			// TODO: Deprecate this
			if (Array.isArray(logo)) {
				logo = { src: logo[0], width: logo[1], height: logo[2] };
			}
		}
		return (
			<div className="auth-box__col">
				<div className="auth-box__brand">
					<a href="/" className="auth-box__brand__logo">
						<img src={logo.src} width={logo.width ? logo.width : null} height={logo.height ? logo.height : null} alt={this.props.brand} />
					</a>
				</div>
			</div>
		);
	}
});

module.exports = Brand;
