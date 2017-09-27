/* eslint-disable */

const semver = require('semver');
const branches = [];
const DONE = '%DONE%';
process.stdin.on('data', (data) => {
	const branch = data.toString().trim();
	if (branch === DONE) {
		filterBranches();
	}
	branches.push(branch.toString());
});

function filterBranches () {
	const dependencies = branches.reduce((dependencies, branch) => {
		const [_, __, ___, ____, dependency, version] = branch.match(/(greenkeeper)-((([a-zA-Z0-9]*)-)*)([0-9]*.[0-9]*.[0-9]*)/);
		const previous = dependencies[dependencies];
		if (previous) {
			if (semver.gt(version, previous.version)) {
				dependencies[dependency] = { version, name: dependency };
			}
		} else {
			dependencies[dependency] = { version, name: dependency };
		}
		return dependencies;
	}, {});
	Object.keys(dependencies).reduce((acc, k) => acc.concat(dependencies[k]), []).forEach(dependency => {
		console.log(`greenkeeper-${dependency.name}-${dependency.version}`);
	});
}
