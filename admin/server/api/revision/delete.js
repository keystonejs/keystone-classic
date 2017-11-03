module.exports = (req, res) => {
	const { keystone } = req;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}

	const list = req.body.list || req.params.list;
	const target = req.body.rollback || req.params.rollback;
	const revisions = keystone.lists[list].HistoryModel;

	revisions.findById(target).remove().exec();
	res.status(200).send({ details: 'Deletion successful' });
};
