import React, { Component } from 'react';
import { makeSection } from './utils';
import { api, documentation, gettingStarted, guides } from '../../data/navigation';

const sections = [gettingStarted, guides, documentation, api];

export default class Menu extends Component {
	render () {
		return <nav>{makeSection('', sections, this.props.pathname)}</nav>;
	}
};
