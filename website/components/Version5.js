import React from "react";
import { compose } from "glamor";
import Link from "gatsby-link";
export default () => (
	<div className={compose(styles.wrapper)}>
		<div>
			<p className={compose(styles.p)}>
				If you're looking for the latest version of Keystone checkout{" "}
				<Link to="https://keystonejs.com/">Keystone 5</Link>. Version 4 will
				continue to receive critical updates but new users should choose version
				5.
			</p>
		</div>
	</div>
);

const styles = {
	wrapper: {
		background: "#fff5d7",
		color: "black",
		padding: "1rem",
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	p: {
		color: "#856404",
		padding: 0,
		margin: 0
	}
};
