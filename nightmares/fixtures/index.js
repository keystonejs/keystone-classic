var fs = require('fs');
exports.homepageText = fs.readFileSync(__dirname + '/homepage.txt', 'utf-8');
exports.e2eMemberDetails = fs.readFileSync(__dirname + '/e2e-member-table-row.html', 'utf-8');
