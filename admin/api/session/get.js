function get (req, res) {
	return res.json({ user: req.user });
}

module.exports = get;
