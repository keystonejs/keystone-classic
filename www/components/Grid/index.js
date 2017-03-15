import React, { Children, cloneElement, PropTypes } from 'react';
import { compose } from 'glamor';
import widthMap from './widths';
import { rhythm } from '../../utils/typography';
import theme from '../../theme';

const propTypes = {
	component: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.string,
	]),
};
const defaultProps = {
	component: 'div',
};

// Row

export function Row ({
	children,
	component: Tag,
	small,
	medium,
	large,
	...props
}) {
	const tagStyles = compose({
		display: 'flex',
		flexWrap: 'wrap',
		marginLeft: `-${rhythm(1)}`,
		marginRight: `-${rhythm(1)}`,
	});
	const childProps = { small, medium, large };

	return (
		<Tag {...tagStyles} {...props}>
			{(small || medium || large)
				? Children.map(children, (c) => cloneElement(c, childProps))
				: children
			}
		</Tag>
	);
};

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

// Col

export function Col ({
	component: Tag,
	small,
	medium,
	large,
	...props
}) {
	const tagStyles = compose({
		paddingLeft: rhythm(1),
		paddingRight: rhythm(1),
		width: small ? widthMap[small] : '100%',
	}, {
		[theme.breakpoint.mediumUp]: {
			width: widthMap[medium],
		},
		[theme.breakpoint.largeUp]: {
			width: widthMap[large],
		},
	});

	return <Tag {...tagStyles} {...props} />;
};

Col.propTypes = propTypes;
Col.defaultProps = defaultProps;

export default { Col, Row };
