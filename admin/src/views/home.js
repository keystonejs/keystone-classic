var React = require('react');

var View = React.createClass({
	
	displayName: 'HomeView',
	
	renderFlatNav: function() {
		return Keystone.lists.map((list) => {
			var href = list.external ? list.path : '/keystone/' + list.path;
			return (
				<h3 key={list.path}>
					<a href={href}>{list.label}</a>
				</h3>
			);
		});
	},

	renderGroupedNav: function() {
		return (
			<div>
				{Keystone.nav.sections.map((navSection) => {
					var headingClassName = 'model-group__heading octicon';
					
					if (navSection.key === 'events') { headingClassName += ' octicon-calendar'; }
					else if (navSection.key === 'people') { headingClassName += ' octicon-organization'; }
					else if (navSection.key === 'listings') { headingClassName += ' octicon-briefcase'; }
					else if (navSection.key === 'places') { headingClassName += ' octicon-location'; }
					else if (navSection.key === 'posts') { headingClassName += ' octicon-book'; }
					else if (navSection.key === 'jobs') { headingClassName += ' octicon-megaphone'; }
					else if (navSection.key === 'forums') { headingClassName += ' octicon-podium'; }
					else { headingClassName += ' octicon-primitive-dot'; }
					
					return (
						<div className="model-group" key={navSection.key}>
							<div className={headingClassName}>
								{navSection.label}
							</div>
							<ul className="model-group__list">
								{navSection.lists.map((list) => {
									var href = list.external ? list.path : '/keystone/' + list.path;
									return (
										<li key={list.path}>
											<a href={href}>
												<div className="model-group__list-label">{list.label}</div>
												<div>4 Items</div>
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					);
				})}
				{() => {
					if (!Keystone.orphanedLists.length) return;
					return (
						<div className="model-group">
							<div className="model-group__heading octicon octicon-database">
								Other
							</div>
							<ul className="model-group__list">
								{Keystone.orphanedLists.map((list) => {
									return (
										<li key={list.path}>
											<a href={'/keystone/' + list.path}>
												<div className="model-group__list-label">{list.label}</div>
												<div>4 Items</div>
											</a>
										</li>
									);
								})}
							</ul>
						</div>
					);
				}()}
			</div>
		);
	},

	render: function() {
		return (
			<div className="container">
				<div className="page-header"><h1>Dashboard</h1></div>
				<div className="model-groups">
					{Keystone.nav.flat ? this.renderFlatNav() : this.renderGroupedNav()}
				</div>
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('home-view'));
