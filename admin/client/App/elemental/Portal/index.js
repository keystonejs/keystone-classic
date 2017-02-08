import React, { Component, PropTypes } from 'react';
import Transition from 'react-addons-css-transition-group';
import { render } from 'react-dom';
import PassContext from '../PassContext';


export default class Portal extends Component {
	constructor () {
		super();
		this.portalElement = null;
	}
	componentDidMount () {
		const p = document.createElement('div');
		document.body.appendChild(p);
		this.portalElement = p;
		this.componentDidUpdate();
	}
	componentDidUpdate () {
		// Animate fade on mount/unmount
		const duration = 200;
		const styles = `
				.fade-enter { opacity: 0.01; }
				.fade-enter.fade-enter-active { opacity: 1; transition: opacity ${duration}ms; }
				.fade-leave { opacity: 1; }
				.fade-leave.fade-leave-active { opacity: 0.01; transition: opacity ${duration}ms; }
		`;
		render(
			<PassContext context={this.context}>
				<div>
					<style>{styles}</style>
					<Transition
						component="div"
						transitionName="fade"
						transitionEnterTimeout={duration}
						transitionLeaveTimeout={duration}
						{...this.props}
					/>
				</div>
			</PassContext>,
			this.portalElement
		);
	}
	componentWillUnmount () {
		document.body.removeChild(this.portalElement);
	}
	render () {
		return null;
	}
}

Portal.contextTypes = {
	onClose: PropTypes.func,
};
