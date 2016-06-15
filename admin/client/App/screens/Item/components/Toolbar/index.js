import React, { PropTypes } from 'react';

const Toolbar = (props) => <div {...props} className="Toolbar" />;

Toolbar.displayName = 'Toolbar';
Toolbar.propTypes = {
	children: PropTypes.node.isRequired,
};

module.exports = Toolbar;
