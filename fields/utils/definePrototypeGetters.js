/**
 * Defines a getter on the Field prototype
 *
 * @param  {string}   key    The key the getter should be at
 * @param  {function} getter The getter itself
 */
function definePrototypeGetter (Constructor, key, getter) {
	Object.defineProperty(Constructor.prototype, key, {
		get: getter,
	});
}

/**
 * Define multiple getters on the Field prototype at once
 *
 * @param  {object} getterObj The getters with a getter at the key
 */
function definePrototypeGetters (Constructor, getterObj) {
	Object.keys(getterObj).map(function (key) {
		definePrototypeGetter(Constructor, key, getterObj[key]);
	});
}

module.exports = definePrototypeGetters;
module.definePrototypeGetter = definePrototypeGetter;
