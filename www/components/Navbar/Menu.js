import React from 'react';
import { makeSection } from './utils';
import { api, documentation, gettingStarted, guides } from '../../data/navigation';

const sections = [gettingStarted, guides, documentation, api];

export default function Menu () {
	return <nav>{makeSection('', sections, 1)}</nav>;
};
