import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ItemsTableCell from '../ItemsTableCell';
import demand from 'must';

describe('ItemsTableCell tests', () => {
  it('should render the greeting', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<ItemsTableCell p1='v1' p2='v2' className='mock-class'/>);
    const result = renderer.getRenderOutput();

    demand(result.type).eql('td');
    demand(result.props.p1).eql('v1');
    demand(result.props.p2).eql('v2');
    demand(result.props.className).eql('ItemList__col mock-class');
  });
});
