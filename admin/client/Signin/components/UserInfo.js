import React, { PropTypes } from 'react';
import { Button } from '../../App/elemental';

// TODO Figure out if we should change "Keystone" to "Admin area"

const UserInfo = ({
	adminPath,
	signoutPath,
	userCanAccessKeystone,
	userName,
}) => {
	const adminButton = userCanAccessKeystone && (
		<Button href={adminPath} kind="primary">
			Open Keystone
		</Button>
	);

	return (
		<div className="auth-box__col">
			<p>Hi {userName},</p>
			<p>You're already signed in.</p>
			{adminButton}
			<Button href={signoutPath} kind="link-cancel">
				Sign Out
			</Button>
		</div>
	);
};

UserInfo.propTypes = {
	adminPath: PropTypes.string.isRequired,
	signoutPath: PropTypes.string.isRequired,
	userCanAccessKeystone: PropTypes.bool,
	userName: PropTypes.string.isRequired,
};

module.exports = UserInfo;
