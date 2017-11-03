const deepEql = (obj, oth, omitters) => {
	const a = { ...obj };
	const b = { ...oth };
	const { keys } = Object;
	if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
		return false;
	}
	if (Array.isArray(a)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (typeof a[i] === 'object') {
				if (!deepEql(a[i], b[i])) return false;
				continue;
			}
			if (a[i] !== b[i]) return false;
		}
	}
	if (!Array.isArray(omitters)) omitters = [omitters];
	omitters.forEach(omitter => {
		delete a[omitter];
		delete b[omitter];
	});
	if (keys(a).length !== keys(b).length) return false;
	for (const k in a) {
		if (typeof a[k] === 'object') {
			if (!deepEql(a[k], b[k], omitters)) return false;
			continue;
		}
		if (a[k] !== b[k]) return false;
	}
	return true;
};

export default deepEql;
