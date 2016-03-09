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
					return (
						<div className="nav-section" key={navSection.key}>
							<h4>{navSection.label}</h4>
							<ul>
								{navSection.lists.map((list) => {
									var href = list.external ? list.path : '/keystone/' + list.path;
									return (
										<li key={list.path}><a href={href}>{list.label}</a></li>
									);
								})}
							</ul>
						</div>
					);
				})}
				{(() => {
					if (!Keystone.orphanedLists.length) return;
					return (
						<div className="nav-section">
							<h4>Other</h4>
							<ul>
								{Keystone.orphanedLists.map((list) => {
									return (
										<li key={list.path}>
											<a href={'/keystone/' + list.path}>{list.label}</a>
										</li>
									);
								})}
							</ul>
						</div>
					);
				})()}
			</div>
		);
	},

	render: function() {
		return (
			<div>
				<div className="page-header"><h1>Manage</h1></div>
				<div className="keystone-lists">{Keystone.nav.flat ? this.renderFlatNav() : this.renderGroupedNav()}</div>
			</div>
		);
	}
	
});

React.render(<View />, document.getElementById('home-view'));
