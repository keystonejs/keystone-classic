import { Component } from 'react';

export default class ScrollLock extends Component {
	constructor () {
		super();
		this.lockCount = 0;
	}
	componentWillMount () {
		if (typeof window === 'undefined') return;

		this.lockCount++;
		if (this.lockCount > 1) return;

		//	FIXME iOS ignores overflow on body
		try {
			const scrollBarWidth = window.innerWidth - document.body.clientWidth;

			const target = document.body;

			target.style.paddingRight = scrollBarWidth + 'px';
			target.style.overflowY = 'hidden';
		} catch (err) {
			console.error('Failed to find body element. Err:', err);
		}
	}
	componentWillUnmount () {
		if (typeof window === 'undefined' || this.lockCount === 0) return;

		this.lockCount--;
		if (this.lockCount > 0) return; // Still locked

		//	FIXME iOS ignores overflow on body
		try {
			const target = document.body;

			target.style.paddingRight = '';
			target.style.overflowY = '';

		} catch (err) {
			console.error('Failed to find body element. Err:', err);
		}
	}
	render () {
		return null;
	}
}
