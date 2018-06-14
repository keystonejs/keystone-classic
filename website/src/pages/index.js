import React, { Component } from 'react';

import Hero from './components/home/Hero';
import ValueProps from './components/home/ValueProps';
import CommunityResponse from './components/home/CommunityResponse';
import AdminInterface from './components/home/AdminInterface';
import ValueProps2 from './components/home/ValueProps2';
import WhereNext from './components/home/WhereNext';
import Footer from './components/home/Footer';

export default class HomePage extends Component {
	render () {
		return (
			<div>
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
};
