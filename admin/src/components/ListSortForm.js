import classnames from 'classnames';
import React from 'react';

var Transition = React.addons.CSSTransitionGroup;
var CurrentListStore = require('../stores/CurrentListStore');
var Popout = require('./Popout');
var PopoutList = require('./PopoutList');

var ListColumnsForm = React.createClass({
	displayName: 'ListColumnsForm',

	getInitialState () {
		return {
			selectedColumn: null,
			invertSort: false,
		};
	},

	togglePopout (visible) {
		this.setState({
			selectedColumn: null,
			isOpen: visible
		});
	},

	toggleColumn (path) {
		this.setState({
			selectedColumn: path,
		 	invertSort: this.state.selectedColumn === path ? !this.state.invertSort : false
		});
	},

	applyColumns () {
		this.togglePopout(false);
	},

	renderColumns () {
		return CurrentListStore.getAvailableColumns().map((el, i) => {
			if (el.type === 'heading') {
				return <PopoutList.Heading key={'heading_' + i}>{el.label}</PopoutList.Heading>;
			}

			let path = el.field.path;
			let isSelected = this.state.selectedColumn === path;

			return <PopoutList.Item
				key={'column_' + el.field.path}
				icon={isSelected ? (this.state.invertSort ? 'chevron-up' : 'chevron-down') : 'dash'}
				isSelected={isSelected}
				label={el.field.label}
				onClick={() => { this.toggleColumn(path); }} />;
		});
	},

	render () {
		return (
			<span>
				<span> sorted by </span>
				<span style={{ display: 'inline-block', position: 'relative' }}>
					<a href="javascript:;" onClick={this.togglePopout.bind(this, !this.state.isOpen)}>
						{Keystone.sort}
						<span className="disclosure-arrow" />
					</a>
					<Popout isOpen={this.state.isOpen} onCancel={this.togglePopout.bind(this, false)}>
						<Popout.Header title="Sort" />
						<Popout.Body scrollable>
							<PopoutList>
								{this.renderColumns()}
							</PopoutList>
						</Popout.Body>
						<Popout.Footer
							primaryButtonAction={this.applyColumns}
							primaryButtonLabel="Apply"
							secondaryButtonAction={this.togglePopout.bind(this, false)}
							secondaryButtonLabel="Cancel" />
					</Popout>
				</span>
			</span>
		);
	}

});

module.exports = ListColumnsForm;
