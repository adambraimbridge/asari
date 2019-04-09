/* eslint-disable no-console */

/**
 * Helper for formatting and printing GitHub resources.
 *
 * @param {object} options
 * @param {string} options.json
 * @param {object} options.resource
 */
module.exports = function printOutput({ json, resource, error, ...data }) {
	if (error) {
		console.log(`⚠️	Error with GitHub network request/response. ${error.errors ? JSON.stringify(error.errors) : error.message ? error.message : ''}`)
	}
	else if (json === true) {
		const outputObject = Object.assign({}, {
			type: "resource",
			resource,
		}, data)
		console.log(JSON.stringify(outputObject));
	} else {
		console.log(resource.html_url || "OK");
	}
};
