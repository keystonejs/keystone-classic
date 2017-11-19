module.exports = (req, res) => {
	const { keystone } = req;
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	const id = req.body.id || req.params.id;
	const revisions = req.list.HistoryModel;
	console.log('Revisions get:' + id + ' ' + req.params.id);
	// Make sure History has been enabled in model. If not HistoryModel will be undefined.
	if (revisions && revisions.find) {
		revisions.find({ id })
		.sort({ time: -1 })
		.populate('user', 'name')
		.populate('u', 'name')
		.then(items => res.json(items))
		.catch(err => res.json(err));
	} else {
		res.apiError('Get Revisions Failed. Ensure you have history:true in your model options.');
	}

};
