import React, { PropTypes } from "react";

export default function DefaultLayout({ children, location }) {
	// TODO should be explicit prop
	// const isHome = location.pathname.length > 1;

	return <div>{children}</div>;
}

DefaultLayout.PropTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};
