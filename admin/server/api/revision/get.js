module.exports = (req, res) => {
	const { keystone } = req;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	const id = req.body.id || req.params.id;
	const list = req.body.list || req.params.list;
	const revisions = keystone.lists[list].HistoryModel;

	revisions.find({ id })
		.populate('user', 'name')
    .populate('u', 'name')
		.then(items => res.json(items))
		.catch(err => res.json(err));
};
