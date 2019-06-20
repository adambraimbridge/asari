const flatMap = require('lodash.flatmap')

const expandCommaSeparatedValues = array => flatMap(array, (item = '') => item.split(','))

/**
 * Converts strings, strings of comma separated values and arrays of these
 * into a flattened array of values
 *
 * @param {string|array} input - The input string or array of values
 * @return {array} Array of values
 */
const convertToFlattenedArrayOfValues = input => {
	const values = Array.isArray(input) ? input : [input]

	return expandCommaSeparatedValues(values).map(value => value.trim())
}

module.exports = convertToFlattenedArrayOfValues
