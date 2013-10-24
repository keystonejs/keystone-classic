// Credits:
// ========
// 
// Some utils borrowed from / inspired by mongoose/utils.js
// see https://github.com/LearnBoost/mongoose
// 
// HTML Entity encode / decode is based on code in node-html-to-text
// see https://github.com/werk85/node-html-to-text

var _ = require('underscore'),
	inflect = require('i')();

var htmlEntitiesMap = {},
	htmlEntities = {
	apos: 0x0027, quot: 0x0022, amp: 0x0026, lt: 0x003C, gt: 0x003E, nbsp: 0x00A0, iexcl: 0x00A1, cent: 0x00A2, pound: 0x00A3,
	curren: 0x00A4, yen: 0x00A5, brvbar: 0x00A6, sect: 0x00A7, uml: 0x00A8, copy: 0x00A9, ordf: 0x00AA, laquo: 0x00AB,
	not: 0x00AC, shy: 0x00AD, reg: 0x00AE, macr: 0x00AF, deg: 0x00B0, plusmn: 0x00B1, sup2: 0x00B2, sup3: 0x00B3,
	acute: 0x00B4, micro: 0x00B5, para: 0x00B6, middot: 0x00B7, cedil: 0x00B8, sup1: 0x00B9, ordm: 0x00BA, raquo: 0x00BB,
	frac14: 0x00BC, frac12: 0x00BD, frac34: 0x00BE, iquest: 0x00BF, Agrave: 0x00C0, Aacute: 0x00C1, Acirc: 0x00C2, Atilde: 0x00C3,
	Auml: 0x00C4, Aring: 0x00C5, AElig: 0x00C6, Ccedil: 0x00C7, Egrave: 0x00C8, Eacute: 0x00C9, Ecirc: 0x00CA, Euml: 0x00CB,
	Igrave: 0x00CC, Iacute: 0x00CD, Icirc: 0x00CE, Iuml: 0x00CF, ETH: 0x00D0, Ntilde: 0x00D1, Ograve: 0x00D2, Oacute: 0x00D3,
	Ocirc: 0x00D4, Otilde: 0x00D5, Ouml: 0x00D6, times: 0x00D7, Oslash: 0x00D8, Ugrave: 0x00D9, Uacute: 0x00DA, Ucirc: 0x00DB,
	Uuml: 0x00DC, Yacute: 0x00DD, THORN: 0x00DE, szlig: 0x00DF, agrave: 0x00E0, aacute: 0x00E1, acirc: 0x00E2, atilde: 0x00E3,
	auml: 0x00E4, aring: 0x00E5, aelig: 0x00E6, ccedil: 0x00E7, egrave: 0x00E8, eacute: 0x00E9, ecirc: 0x00EA, euml: 0x00EB,
	igrave: 0x00EC, iacute: 0x00ED, icirc: 0x00EE, iuml: 0x00EF, eth: 0x00F0, ntilde: 0x00F1, ograve: 0x00F2, oacute: 0x00F3,
	ocirc: 0x00F4, otilde: 0x00F5, ouml: 0x00F6, divide: 0x00F7, oslash: 0x00F8, ugrave: 0x00F9, uacute: 0x00FA, ucirc: 0x00FB,
	uuml: 0x00FC, yacute: 0x00FD, thorn: 0x00FE, yuml: 0x00FF, OElig: 0x0152, oelig: 0x0153, Scaron: 0x0160, scaron: 0x0161,
	Yuml: 0x0178, fnof: 0x0192, circ: 0x02C6, tilde: 0x02DC, Alpha: 0x0391, Beta: 0x0392, Gamma: 0x0393, Delta: 0x0394,
	Epsilon: 0x0395, Zeta: 0x0396, Eta: 0x0397, Theta: 0x0398, Iota: 0x0399, Kappa: 0x039A, Lambda: 0x039B, Mu: 0x039C,
	Nu: 0x039D, Xi: 0x039E, Omicron: 0x039F, Pi: 0x03A0, Rho: 0x03A1, Sigma: 0x03A3, Tau: 0x03A4, Upsilon: 0x03A5,
	Phi: 0x03A6, Chi: 0x03A7, Psi: 0x03A8, Omega: 0x03A9, alpha: 0x03B1, beta: 0x03B2, gamma: 0x03B3, delta: 0x03B4,
	epsilon: 0x03B5, zeta: 0x03B6, eta: 0x03B7, theta: 0x03B8, iota: 0x03B9, kappa: 0x03BA, lambda: 0x03BB, mu: 0x03BC,
	nu: 0x03BD, xi: 0x03BE, omicron: 0x03BF, pi: 0x03C0, rho: 0x03C1, sigmaf: 0x03C2, sigma: 0x03C3, tau: 0x03C4,
	upsilon: 0x03C5, phi: 0x03C6, chi: 0x03C7, psi: 0x03C8, omega: 0x03C9, thetasym: 0x03D1, upsih: 0x03D2, piv: 0x03D6,
	ensp: 0x2002, emsp: 0x2003, thinsp: 0x2009, zwnj: 0x200C, zwj: 0x200D, lrm: 0x200E, rlm: 0x200F, ndash: 0x2013,
	mdash: 0x2014, lsquo: 0x2018, rsquo: 0x2019, sbquo: 0x201A, ldquo: 0x201C, rdquo: 0x201D, bdquo: 0x201E, dagger: 0x2020,
	Dagger: 0x2021, bull: 0x2022, hellip: 0x2026, permil: 0x2030, prime: 0x2032, Prime: 0x2033, lsaquo: 0x2039, rsaquo: 0x203A,
	oline: 0x203E, frasl: 0x2044, euro: 0x20AC, image: 0x2111, weierp: 0x2118, real: 0x211C, trade: 0x2122, alefsym: 0x2135,
	larr: 0x2190, uarr: 0x2191, rarr: 0x2192, darr: 0x2193, harr: 0x2194, crarr: 0x21B5, lArr: 0x21D0, uArr: 0x21D1,
	rArr: 0x21D2, dArr: 0x21D3, hArr: 0x21D4, forall: 0x2200, part: 0x2202, exist: 0x2203, empty: 0x2205, nabla: 0x2207,
	isin: 0x2208, notin: 0x2209, ni: 0x220B, prod: 0x220F, sum: 0x2211, minus: 0x2212, lowast: 0x2217, radic: 0x221A,
	prop: 0x221D, infin: 0x221E, ang: 0x2220, and: 0x2227, or: 0x2228, cap: 0x2229, cup: 0x222A, "int": 0x222B,
	there4: 0x2234, sim: 0x223C, cong: 0x2245, asymp: 0x2248, ne: 0x2260, equiv: 0x2261, le: 0x2264, ge: 0x2265,
	sub: 0x2282, sup: 0x2283, nsub: 0x2284, sube: 0x2286, supe: 0x2287, oplus: 0x2295, otimes: 0x2297, perp: 0x22A5,
	sdot: 0x22C5, lceil: 0x2308, rceil: 0x2309, lfloor: 0x230A, rfloor: 0x230B, lang: 0x2329, rang: 0x232A, loz: 0x25CA,
	spades: 0x2660, clubs: 0x2663, hearts: 0x2665, diams: 0x2666
};

var htmlEntitiesRegExp = '';
for (var i in htmlEntities) {
	var ent = String.fromCharCode(htmlEntities[i]);
	htmlEntitiesMap[ent] = i;
	htmlEntitiesRegExp += '|' + ent;
}
htmlEntitiesRegExp = new RegExp(htmlEntitiesRegExp.substr(1), 'g');

/**
 * Determines if `arg` is a function.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isFunction = exports.isFunction = function(arg) {
	return ('function' == typeof arg);
}


/**
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isObject = exports.isObject = function(arg) {
	return '[object Object]' == Object.prototype.toString.call(arg);
}


/**
 * Determines if `arg` looks like a valid mongo ObjectId
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isValidObjectId = exports.isValidObjectId = function(arg) {
	var len = arg.length;
	if (len == 12 || len == 24) {
		return /^[0-9a-fA-F]+$/.test(arg);
	} else {
		return false;
	}
}


/**
 * Determines if `arg` is an array.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isArray = exports.isArray = function(arg) {
	return Array.isArray(arg);
}


/**
 * Determines if `arg` is a date.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isDate = exports.isDate = function(arg) {
	return '[object Date]' == Object.prototype.toString.call(arg);
}


/**
 * Determines if `arg` is a string.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isString = exports.isString = function(arg) {
	return 'string' == typeof arg;
}


/**
 * Determines if `arg` is a number.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @return {Boolean}
 * @api public
 */

var isNumber = exports.isNumber = function(arg) {
	return 'number' == typeof arg;
}


/**
 * Make sure an email address looks valid.
 * May cause false-negatives in extremely rare cases, see
 * http://www.regular-expressions.info/email.html
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var isEmail = exports.isEmail = function(str) {
	return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.['a-z0-9!#$%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(str);
} // ' // syntax hilighter fix


/**
 * Copies and merges options with defaults.
 *
 * @param {Object} defaults
 * @param {Object} options
 * @return {Object} the options argument merged with defaults
 * @api public
 */

var options = exports.options = function(defaults, options) {
	
	options = options || {};
	
	if (!defaults)
		return options;
	
	var keys = Object.keys(defaults), i = keys.length, k;

	while (i--) {
		k = keys[i];
		if (!(k in options)) {
			options[k] = defaults[k];
		}
	}

	return options;
	
}


/**
 * Creates a map of options
 *
 * @param {Array} options
 * @param {String} property to map
 * @param {Boolean} clone the options?
 * @return {Object} the map object
 * @api public
 */

var optionsMap = exports.optionsMap = function(arr, property, clone) {
	if (arguments.length == 2 && 'boolean' == typeof property) {
		clone = property;
		property = undefined;
	}
	var obj = {};
	for (var i = 0; i < arr.length; i++) {
		var prop = (property) ? arr[i][property] : arr[i];
		if (clone) {
			prop = _.clone(prop);
		}
		obj[arr[i].value] = prop;
	}
	return obj;
}


/**
 * Recursively binds method properties of an object to a scope
 * and returns a new object containing the bound methods
 *
 * @param {Object} object with method properties, can be nested in other objects
 * @param {Object} scope to bind as `this`
 * @return {Object} a new object containing the bound methods
 * @api public
 */

var bindMethods = exports.bindMethods = function(obj, scope) {
			
	var bound = {};
	
	for (var prop in obj) {
		if ('function' == typeof obj[prop]) {
			bound[prop] = obj[prop].bind(scope);
		} else if (isObject(obj[prop])) {
			bound[prop] = bindMethods(obj[prop], scope);
		}
	}
	
	return bound;
	
}


/**
 * Converts a string to a number, accepting human-friendly input, e.g.
 * - 1,432
 * - $1432
 * - 2.5
 *
 * @param {String} input
 * @return {Number} number
 * @api public
 */

var number = exports.number = function(str) {
	return parseFloat(String(str).replace(/[^\-0-9\.]/g, ''));
}


/**
 * Escapes a string to be safely converted to a regular expression
 *
 * @param {String} string
 * @return {String} escaped string
 * @api public
 */

var escapeRegExp = exports.escapeRegExp = function(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}


/**
 * Generates a slug from a string. Word breaks are hyphenated.
 * 
 * You can optionally provide a custom separator.
 *
 * @param {String} str
 * @param {String} sep (defaults to '-')
 * @return {String} slug
 * @api public
 */

var slug = exports.slug = function(str, sep) {
	sep = sep || '-';
	var esc = escapeRegExp(sep);
	return str.replace(/['"()\.]/g, '').replace(/[^a-z0-9_\-]+/gi, sep).replace(new RegExp(esc + '+', 'g'), sep).replace(new RegExp('^' + esc + '+|' + esc + '+$'), '').toLowerCase();
}


/**
 * Converts a string to its singular form
 *
 * @param {String} str
 * @return {String} singular form of str
 * @api public
 */

var singular = exports.singular = function(str) {
	return inflect.singularize(str);
}


/**
 * Displays the singular or plural of a string based on a number
 * or number of items in an array.
 * 
 * If arity is 1, returns the plural form of the word.
 *
 * @param {String} count
 * @param {String} singular string
 * @param {String} plural string
 * @return {String} singular or plural, * is replaced with count
 * @api public
 */

var plural = exports.plural = function(count, sn, pl) {
	
	if (arguments.length == 1) {
		return inflect.pluralize(count);
	}
	
	if (!pl) {
		pl = inflect.pluralize(sn);
	}
	
	if ('string' == typeof count) {
		count = Number(count);
	} else if ('number' != typeof count) {
		count = _.size(count);
	}
	
	return (count == 1 ? sn : pl).replace('*', count);
	
}


/**
 * Converts the first letter in a string to uppercase
 *
 * @param {String} str
 * @return {String} Str
 * @api public
 */

var upcase = exports.upcase = function(str) {
	return (str.substr(0,1).toUpperCase() + str.substr(1));
}


/**
 * Converts the first letter in a string to lowercase
 *
 * @param {String} Str
 * @return {String} str
 * @api public
 */

var downcase = exports.downcase = function(str) {
	return (str.substr(0,1).toLowerCase() + str.substr(1));
}


/**
 * Converts a string to title case
 *
 * @param {String} str
 * @return {String} Title Case form of str
 * @api public
 */

var titlecase = exports.titlecase = function(str) {
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	var parts = str.split(/\s|_|\-/);
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
			parts[i] = upcase(parts[i]);
		}
	}
	return _.compact(parts).join(' ');
}


/**
 * Converts a string to camel case
 *
 * @param {String} str
 * @param {Boolean} lowercaseFirstWord
 * @return {String} camel-case form of str
 * @api public
 */

var camelcase = exports.camelcase = function(str, lc) {
	return inflect.camelize(str, !(lc));
}


/**
 * Decodes HTML Entities in a string
 *
 * @param {String}
 * @return {String}
 * @api public
 */

var decodeHTMLEntities = exports.decodeHTMLEntities = function(str) {
	if ('string' != typeof str) return str;
	return str.replace(/&[^;]+;/g, function(match, ent) {
		return String.fromCharCode(ent[0] !== '#' ? htmlEntities[ent] : ent[1] === 'x' ? parseInt(ent.substr(2),16) : parseInt(ent.substr(1), 10));
	});
};


/**
 * Encodes HTML Entities in a string
 *
 * @param {String}
 * @return {String}
 * @api public
 */

var encodeHTMLEntities = exports.decodeHTMLEntities = function(str) {
	if ('string' != typeof str) return str;
	return str.replace(htmlEntitiesRegExp, function(match) {
		return '&' + htmlEntitiesMap[match] + ';';
	});
};


/**
 * Converts text to HTML (line breaks to <br> etc)
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var textToHTML = exports.textToHTML = function(str) {
	if ('string' != typeof str) return str;
	return encodeHTMLEntities(str).replace(/\n/g, '<br>');
}


/**
 * Ultra simple converter to turn HTML into text.
 * 
 * Really only useful when you need a lightweight way to remove html from a string
 * before cropping it, so you don't end up with partial tags or an invalid DOM
 * structure.
 * 
 * It will convert `br`, `p`, `div`, `li`, `td`, `th` tags to single line-breaks.
 * All other tags are stripped.
 * 
 * Multiple line breaks are then compressed to a single line break, and leading /
 * trailing white space is stripped.
 * 
 * For a more sophisticated use-case, you should check out the `to-markdown` and
 * `html-to-text` packages on npm.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

var htmlToText = exports.htmlToText = function(str) {
	// remove all source-code line-breaks first
	str = str.replace(/\n/g, '');
	// turn non-breaking spaces into normal spaces
	str = str.replace(/&nbsp;/g, ' ');
	// <br> tags become single line-breaks
	str = str.replace(/<br>/gi, '\n');
	// <p>, <li>, <td> and <th> tags become double line-breaks
	str = str.replace(/<(?:p|li|td|th)[^>]*>/gi, '\n');
	// strip all other tags (including closing tags)
	str = str.replace(/<[^>]*>/g, '');
	// compress white space
	str = str.replace(/(\s)\s+/g, '$1');
	// remove leading or trailing spaces
	str = str.replace(/^\s+|\s+$/g, '');
	return decodeHTMLEntities(str);
}


/**
 * Crops a string to the specified length.
 * 
 * You can optionally a string to append (only appended if the original string was longer
 * than the specified length).
 * 
 * If preserveWords is true, the length is extended to the end of the last word that would
 * have been cropped.
 *
 * @param {String} string to crop
 * @param {Number} length to crop to
 * @param {String} string to append
 * @param {Boolean} whether to preserve the last word in full
 * @return {String} cropped string
 * @api public
 */

var cropString = exports.cropString = function(str, length, append, preserveWords) {
	
	if (!str || !str.length) return '';
	
	if ('boolean' == typeof append) {
		preserveWords = append;
		append = null;
	}
	
	str = String(str);
	
	if (str.length <= length) return str;
	
	var cropTo = length;
	
	if (preserveWords) {
		var r = str.substr(cropTo);
		var word = r.match(/^\w+/);
		if (word && word.length) {
			cropTo += word[0].length;
		}
	}
	
	var rtn = str.substr(0, cropTo);
	
	return (rtn.length < str.length && append) ? rtn + append : rtn;
	
}


/**
 * Crops an HTML string safely by converting it to text, cropping it, then converting it
 * back to HTML.
*/

var cropHTMLString = exports.cropHTMLString = function(str, length, append, preserveWords) {
	return textToHTML(cropString(htmlToText(str), length, append, preserveWords));
}


/**
 * Converts a key to a label.
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToLabel = exports.keyToLabel = function(str) {
	
	str = str.replace(/([a-z])([A-Z])/g, '$1 $2');
	str = str.replace(/([0-9])([a-zA-Z])/g, '$1 $2');
	str = str.replace(/([a-zA-Z])([0-9])/g, '$1 $2');
	var parts = str.split(/\s|\.|_|-|:|;|\b/);
	
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] && !/^[A-Z0-9]+$/.test(parts[i])) {
			parts[i] = upcase(parts[i]);
		}
	}
	
	return _.compact(parts).join(' ');
	
}


/**
 * Converts a key to a path. Like slug(keyToLabel(str)) but
 * optionally converts the last word to a plural.
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToPath = exports.keyToPath = function(str, plural) {
	parts = slug(keyToLabel(str)).split('-');
	if (parts.length && plural) {
		parts[parts.length-1] = inflect.pluralize(parts[parts.length-1])
	}
	return parts.join('-');
}


/**
 * Converts a key to a property. Like keyToPath but converts
 * to headlessCamelCase instead of dash-separated
 *
 * @param {String} key
 * @return {String}
 * @api public
 */

var keyToProperty = exports.keyToProperty = function(str, plural) {
	parts = slug(keyToLabel(str)).split('-');
	if (parts.length && plural) {
		parts[parts.length-1] = inflect.pluralize(parts[parts.length-1])
	}
	for (var i = 1; i < parts.length; i++) {
		parts[i] = upcase(parts[i]);
	}
	return parts.join('');
}


/**
 * Path Class
 * 
 * @api public
 */

var Path = exports.Path = function(str) {
	
	if (!(this instanceof Path))
		return new Path(options);
	
	this.original = str;
	
	var parts = this.parts = str.split('.');
	var last = this.last = this.parts[this.parts.length-1];
	var exceptLast = [];
	
	for (var i = 0; i < parts.length-1; i++) {
		exceptLast.push(parts[i]);
	}
	
	this.exceptLast = exceptLast.join('.');
	
	this.addTo = function(obj, val) {
		var o = obj;
		for (var i = 0; i < parts.length - 1; i++) {
			if (!isObject(o[parts[i]]))
				o[parts[i]] = {};
			o = o[parts[i]];
		}
		o[last] = val;
		return obj;
	}
	
	this.get = function(obj) {
		var o = obj;
		for (var i = 0; i < parts.length; i++) {
			o = o[parts[i]];
		}
		return o;
	}
	
	this.prependToLast = function(prepend, titlecase) {
		var rtn = '';
		for (var i = 0; i < parts.length - 1; i++) {
			rtn += parts[i] + '.';
		}
		return rtn + (prepend || '') + (titlecase ? upcase(last) : last);
	}
	
	this.append = function(append) {
		return str + append;
	}
	
	this.flatten = function(titlecase) {
		return camelcase(parts.join('_'), titlecase ? true : false);
	}
	
	this.flattenplural = function(titlecase) {
		return camelcase([].concat(exceptLast).concat(plural(last)).join('_'), titlecase ? true : false);
	}
	
	this.flattensingular = function(titlecase) {
		return camelcase([].concat(exceptLast).concat(singular(last)).join('_'), titlecase ? true : false);
	}
	
	return this;
	
}
