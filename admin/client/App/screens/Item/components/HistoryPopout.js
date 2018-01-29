import React from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Popout from '../../../shared/Popout';
import PopoutList from '../../../shared/Popout/PopoutList';

export default React.createClass({
	displayName: 'HistoryPopout',
	propTypes: {
		data: React.PropTypes.object,
		list: React.PropTypes.object
    },
    getInitialState () {
        return {
            selectedRev: this.props.rev
        };
    },
	setSelectedRevision (rev) {
		this.setState({
			selectedRev: rev
		});
	},
	historyColumns () {
		const { revisions } = this.props.data.history;
		const { rev } = this.props.data;
		let { selectedRev } = this.state;

		if (revisions == null || revisions.length === 0) {
			return <span>This item has no revisions.</span>;
		}

		if (selectedRev == null) {
			if (rev != null) {
				selectedRev = rev;
			}
		}

		return revisions.map((r, i) => {
			let selected = selectedRev == null 
				? i === 0
				: selectedRev._id === r._id;

            const name = `${r.u.name.first} ${r.u.name.last}`.trim();
            const label = `${moment(r.t).format('LLL')} (${name})`;

			return (<PopoutList.Item
				key={'rev_' + i}
				icon={selected ? 'check' : ''}
				iconHover={selected ? '' : 'check'}
				isSelected={selected}
				label={label}
				onClick={() => { this.setSelectedRevision(r); }} />
			);
		})
    },
    renderFooter () {
        const { revisions } = this.props.data.history;

        if (revisions == null || revisions.length === 0) {
            return;
        }
        
        if (this.state.selectedRev) {
            return (
                <Popout.Footer
					primaryButtonAction={() => this.props.onApply(this.state.selectedRev)}
					primaryButtonLabel="Apply"
					secondaryButtonAction={this.onCancel}
					secondaryButtonLabel="Cancel" />
            );
        } else {
            return (
                <Popout.Footer
					secondaryButtonAction={this.onCancel}
					secondaryButtonLabel="Cancel" />
            );
        }
    },
    onCancel () {
        this.setState(this.getInitialState());

        this.props.onCancel();
    },
	render () {
		if (!this.props.list.history) {
			return;
		}

		return (
			<Popout {...this.props} onCancel={this.onCancel}>
				<Popout.Header title="Revisions" />
				<Popout.Body scrollable>
					{this.historyColumns()}
				</Popout.Body>
				{this.renderFooter()}
			</Popout>
		);
	},
});
