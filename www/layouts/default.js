import React from 'react';
import Navigation from 'components/navigation';
import Sidebar from 'components/sidebar';
import { rhythm } from 'utils/typography';
import { presets } from 'glamor';
import Drawer from 'react-motion-drawer';
require('../css/prism-coy.css');
require('typeface-libre-franklin');
require('typeface-ubuntu-mono');

class DefaultLayout extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			sidebarOpen: false,
		};
	}

	componentDidMount () {
    // Create references to html/body elements
		this.htmlElement = document.querySelector('html');
		this.bodyElement = document.querySelector('body');
	}

	render () {
    // Freeze the background when the overlay is open.
		if (this.htmlElement && this.bodyElement) {
			if (this.state.mobileSidebarOpen) {
				this.htmlElement.style.overflow = 'hidden';
				this.bodyElement.style.overflow = 'hidden';
			} else {
				this.htmlElement.style.overflow = 'visible';
				this.bodyElement.style.overflow = 'visible';
			}
		}
    // const activeSection = basepath(this.props.location.pathname)
		return (
			<div>
				<Navigation
					home="/"
					location={this.props.location}
					openSidebar={() => {
						this.setState({ sidebarOpen: true });
					}}
        />
				<Drawer
					open={this.state.sidebarOpen}
					onChange={(open) => this.setState({ sidebarOpen: open })}
        >
					<div
						onClick={() => this.setState({ sidebarOpen: false })}
          >
						<div
							css={{
								background: 'white',
								minHeight: '100vh',
								height: '100%',
								padding: rhythm(3 / 4),
							}}
            >
							<Sidebar />
						</div>
					</div>
				</Drawer>
				<div
					css={{
						display: 'block',
						minHeight: 'calc(100vh - 94px)',
						position: 'relative',
						paddingTop: rhythm(1 / 2),
						paddingLeft: rhythm(3 / 4),
						paddingRight: rhythm(3 / 4),
						margin: '0 auto',
						width: '100%',
						[presets.Tablet]: {
							maxWidth: rhythm(37),
							paddingTop: rhythm(1),
						},
					}}
        >
					<div
						css={{
							display: 'none',
							[presets.Tablet]: {
								display: 'block',
								float: 'left',
							},
						}}
          >
						<Sidebar />
					</div>
					<div
						css={{
							paddingLeft: 0,
							[presets.Tablet]: {
								paddingLeft: rhythm(11),
							},
						}}
          >
						{ this.props.children }
					</div>
				</div>
			</div>
		);
	}
}

export default DefaultLayout;
