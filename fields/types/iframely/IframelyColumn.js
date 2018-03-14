import React, { Component } from 'React';

class IframelyColumn extends Component {
	render () {
		const { data, col } = this.props;

		const value = data.fields[col.path];
		if (!value || !_.size(value)) return null;

		return (
			<td>
				<div className="ItemList__value">
					{value && (
						<a href={value.url} target="_blank">
							{value.url}
						</a>
					)}
				</div>
			</td>
		);
	}
};

module.exports = IframelyColumn;
