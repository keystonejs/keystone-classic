import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { plural } from '../../../../utils/string';
import ListTile from './ListTile';

export class Lists extends React.Component {
	render () {
		return (
			<div className="dashboard-group__lists">
				{_.map(this.props.lists, (list, key) => {
					// If an object is passed in the key is the index,
					// if an array is passed in the key is at list.key
					const listKey = list.key || key;
					const href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
					const listData = this.props.listsData[list.path];
					const isNoCreate = listData ? listData.nocreate : false;
					return (
						<ListTile
							key={list.path}
							path={list.path}
							label={list.label}
							hideCreateButton={isNoCreate}
							href={href}
							count={plural(this.props.counts[listKey], '* Item', '* Items')}
							spinner={this.props.spinner}
						/>
					);
				})}
			</div>
		);
	}
}

Lists.propTypes = {
	counts: React.PropTypes.object.isRequired,
	lists: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.object,
	]).isRequired,
	spinner: React.PropTypes.node,
};

export default connect((state) => {
	return {
		listsData: state.lists.data,
	};
})(Lists);
