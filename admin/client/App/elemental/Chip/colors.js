import theme from '../../../theme';
import { fade, lighten } from '../../../utils/color';

const baseColors = {};
['danger', 'info', 'primary', 'success', 'warning'].forEach(color => {
	baseColors[color] = {
		background: fade(theme.color[color], 10),
		backgroundActive: fade(theme.color[color], 20),
		backgroundHover: fade(theme.color[color], 15),
		text: theme.color[color],
	};
});
const invertedColors = {};
['danger', 'info', 'primary', 'success', 'warning'].forEach(color => {
	invertedColors[color + '__inverted'] = {
		background: theme.color[color],
		backgroundActive: lighten(theme.color[color], 5),
		backgroundHover: lighten(theme.color[color], 15),
		text: 'white',
	};
});

module.exports = {
	default: {
		background: theme.color.gray10,
		backgroundActive: theme.color.gray20,
		backgroundHover: theme.color.gray15,
		text: theme.color.gray60,
	},
	...baseColors,

	// inverted
	default__inverted: {
		background: theme.color.gray60,
		backgroundActive: lighten(theme.color.gray60, 5),
		backgroundHover: lighten(theme.color.gray60, 15),
		text: 'white',
	},
	...invertedColors,
};
