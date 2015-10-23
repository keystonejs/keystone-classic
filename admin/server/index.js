var compression = require('compression');
var bodyParser = require('body-parser');
var express = require('express');

exports.createServer = function createServer(keystone) {
	var admin = express.Router();

	admin.use(bodyParser.json());
	admin.use(bodyParser.urlencoded({ extended: true }));

	return admin;
};
