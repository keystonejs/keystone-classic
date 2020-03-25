module.exports = {
	Field: require("../UrlField"),
	Filter: require("../UrlFilter"),
	readme: require("fs").readFileSync("./fields/types/url/Readme.md", "utf8"),
	section: "Text",
	spec: {
		label: "Url",
		path: "textarea",
		value: "http://keystonejs.com"
	}
};
