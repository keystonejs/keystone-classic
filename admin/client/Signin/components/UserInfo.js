import React from 'react';
import { Button} from 'elemental';


var UserInfo = React.createClass({
	render: function(){
		if (!this.props.user) return null;
		const openKeystoneButton = this.props.userCanAccessKeystone ? <Button href={Keystone.adminPath} type="primary">Open Keystone</Button> : null;
		return (
			<div className="auth-box__col">
				<p>Hi {this.props.user.name.first},</p>
				<p>You're already signed in.</p>
				{openKeystoneButton}
				<Button href={`${Keystone.adminPath}/signout`} type="link-cancel">Sign Out</Button>
			</div>
			);
	}
});

module.exports = UserInfo;