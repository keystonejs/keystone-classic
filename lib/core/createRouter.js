var express = require('express');

/*
	This is a shorthand method for keystone instances to create a new express
	router, to make it simpler for projects that don't directly depend on express
*/
function createRouter () {
	return express.Router();
}

module.exports = createRouter;
