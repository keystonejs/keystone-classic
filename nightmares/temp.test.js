var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: process.env.SHOW_ELECTRON || false, waitTimeout: 3000 });

describe('Should open redux test', function () {
	this.timeout(10000);
	it('should pass', function (done) {
		nightmare
		.goto('http://redux.js.org/docs/api/Store.html#getState')
		.click('h3#dispatchaction > a:nth-child(2) > code:nth-child(1)')
		.click('div#book-search-results > div.search-noresults:nth-child(1) > section.normal.markdown-section:nth-child(1) > p:nth-child(15) > a:nth-child(3) > code:nth-child(1)')
		.click('div#book-search-results > div.search-noresults:nth-child(1) > section.normal.markdown-section:nth-child(1) > p:nth-child(15) > a:nth-child(1) > code:nth-child(1)')
		.click('div#book-search-results > div.search-noresults:nth-child(1) > section.normal.markdown-section:nth-child(1) > ol:nth-child(18) > li:nth-child(1) > a:nth-child(8)')
		.end()
		.then(function (result) { done(); })
		.catch(done);
	});
});
