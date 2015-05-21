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
					var headingIconClass = 'dashboard-group__heading-icon octicon ';
					
					if (navSection.key === 'events') { headingIconClass += ' octicon-calendar'; }
					else if (navSection.key === 'people') { headingIconClass += ' octicon-organization'; }
					else if (navSection.key === 'listings') { headingIconClass += ' octicon-briefcase'; }
					else if (navSection.key === 'places') { headingIconClass += ' octicon-location'; }
					else if (navSection.key === 'posts') { headingIconClass += ' octicon-book'; }
					else if (navSection.key === 'jobs') { headingIconClass += ' octicon-megaphone'; }
					else if (navSection.key === 'forums') { headingIconClass += ' octicon-podium'; }
					else { headingIconClass += ' octicon-primitive-dot'; }
					
					return (
						<div className="dashboard-group" key={navSection.key}>
							<div className="dashboard-group__heading">
								<span className={headingIconClass} />
								{navSection.label}
							</div>
							<ul className="dashboard-group__list">
								{navSection.lists.map((list) => {
									var href = list.external ? list.path : '/keystone/' + list.path;
									return (
										<li key={list.path}>
											<a href={href}>
												<div className="dashboard-group__list-label">{list.label}</div>
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
						<div className="dashboard-group">
							<div className="dashboard-group__heading">
								<span className="dashboard-group__heading-icon  octicon octicon-database" />
								Other
							</div>
							<ul className="dashboard-group__list">
								{Keystone.orphanedLists.map((list) => {
									return (
										<li key={list.path}>
											<a href={'/keystone/' + list.path}>
												<div className="dashboard-group__list-label">{list.label}</div>
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
				<div className="page-header"><h1>{Keystone.brand}</h1></div>
				<div className="dashboard-groups">
					{Keystone.nav.flat ? this.renderFlatNav() : this.renderGroupedNav()}
				</div>
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('home-view'));
