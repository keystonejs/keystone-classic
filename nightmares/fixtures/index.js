var fs = require('fs');
exports.homepageText = fs.readFileSync(__dirname + '/homepage.txt', 'utf-8');
