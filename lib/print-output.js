/* eslint-disable no-console */

/**
 * Helper for formatting and printing GitHub resources and errors.
 *
 * @param {object} options            This object is destructured to get the required data
 * @param {boolean} options.json      Display output in stringified JSON format
 * @param {object} options.resource   The resource returned from the GitHub API
 * @param {object} options.error      Output an error rather than a resource
 * @param {object} options[...data]   Output any additional properties as appropriate
 */
module.exports = function printOutput({ json, resource, error, ...data }) {
	if (error) {
		console.log(`Error with GitHub network request/response. ${error.errors ? JSON.stringify(error.errors) : error.message ? error.message : ''}`)
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
