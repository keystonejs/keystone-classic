var React = require('react'),
	moment = require('moment');

module.exports = React.createClass({
	
	displayName: 'Revisions',
	
	renderRevisions: function() {
		return _.map(this.props.data, function(rev) {
			var operation;
			
			switch(rev.o) {
				case 'u':
					operation = 'Update';
					break;
				
				case 'c':
					operation = 'Create';
					break;
				
				case 'r':
					operation = 'Remove';
					break;
			}
			
			return (
	        	<tr key={rev._id}>
	        		<td>{moment(rev.t).fromNow()}</td>
	        		<td>{operation}</td>
	        		<td>{rev.c.join(', ')}</td>
        		</tr>
	        );
		});
	},
	
	render: function() {
		if(!Array.isArray(this.props.data)) {
			return;
		}
		
		return (
	        <div>
	      		<h3 className="revisions-heading">Revisions</h3>
	      		<table>
	      			<thead>
	      				<tr>
	      					<th>When</th>
	      					<th>Type</th>
	      					<th>Changed</th>
      					</tr>
  					</thead>
  					<tbody>
	        			{this.renderRevisions()}
        			</tbody>
    			</table>
	        </div>
        );
	}
	
});
