import { css } from 'aphrodite';

const truthy = i => i;

function append (internal, external) {
	return external
		? `${internal} ${external}`
		: internal;
}

export default function cssClassNames (arr, str) {
	const base = css.apply(undefined, arr.filter(truthy));

	return append(base, str);
};
