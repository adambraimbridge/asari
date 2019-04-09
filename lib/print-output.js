/* eslint-disable no-console */

/**
 * Helper for formatting and printing GitHub resources.
 *
 * @param {object} options
 * @param {string} options.json
 * @param {object} options.resource
 */
module.exports = function printOutput({ json, resource, error }) {
	if (error) {
		console.log(`⚠️	Error with GitHub network request/response. ${error.errors ? JSON.stringify(error.errors) : ''}`)
	}
	else if (json === true) {
		const jsonOutput = JSON.stringify({
			type: "resource",
			resource
		});
		console.log(jsonOutput);
	} else {
		console.log(resource.html_url || "OK");
	}
};
