import React from 'react';
import { Button } from 'elemental';

const UserInfo = function (props) {
	// Cannot return "null" from stateless components
	if (!props.user) return <span />;
	return (
		<div className="auth-box__col">
			<p>Hi {props.user.name.first},</p>
			<p>You're already signed in.</p>
			{/* If the user can access Keystone, render an "Open Keystone" button */}
			{/* TODO Figure out if we should change "Keystone" to "Admin area" */}
			{props.userCanAccessKeystone ? (
				<Button
					href={Keystone.adminPath}
					type="primary"
				>
					Open Keystone
				</Button>
			) : null}
			<Button
				href={`${Keystone.adminPath}/signout`}
				type="link-cancel"
			>
				Sign Out
			</Button>
		</div>
	);
};

module.exports = UserInfo;
