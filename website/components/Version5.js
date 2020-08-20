import React from "react";
import { compose } from "glamor";

export default () => (
	<div className={compose(styles.wrapper)}>
		<div>
			<p className={compose(styles.p)}>
				These are the version 4 docs. Looking for the{" "}
				<a href="https://keystonejs.com/">latest version of Keystone</a>?
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
		alignItems: "center",
	},
	p: {
		color: "#856404",
		padding: 0,
		margin: 0,
	},
};
