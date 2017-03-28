import React from 'react';
import { itemsShape, makeSection } from './utils';
import { api, documentation, gettingStarted, guides } from './data';

const sections = [gettingStarted, guides, documentation, api];

export default function Menu ({ items }) {
	return <nav>{makeSection('', items, 1)}</nav>;
};

Menu.propTypes = {
	items: itemsShape.isRequired,
};
Menu.defaultProps = {
	items: sections,
};
