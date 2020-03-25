import React, { Component } from "react";
import Helmet from "react-helmet";

import Hero from "./components/home/Hero";
import ValueProps from "./components/home/ValueProps";
import CommunityResponse from "./components/home/CommunityResponse";
import AdminInterface from "./components/home/AdminInterface";
import ValueProps2 from "./components/home/ValueProps2";
import WhereNext from "./components/home/WhereNext";
import Footer from "./components/home/Footer";
import Version5 from "../../components/Version5";

export default class HomePage extends Component {
	render() {
		return (
			<div>
				<Helmet defaultTitle={"KeystoneJS"} titleTemplate={"%s | KeystoneJS"}>
					<meta name="twitter:site" content="@keystonejs" />
					<meta name="og:type" content="website" />
					<meta name="og:site_name" content="KeystoneJS" />
					<html lang="en" />
				</Helmet>
				<Version5 />
				<Hero />
				<ValueProps />
				<CommunityResponse />
				<AdminInterface />
				<ValueProps2 />
				<WhereNext />
				<Footer />
			</div>
		);
	}
}
