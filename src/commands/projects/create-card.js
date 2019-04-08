const flow = require('lodash.flow');

const github = require("../lib/github");
const { withToken, withJson } = require("../lib/helpers/yargs/options");
const printOutput = require("../lib/helpers/print-output");

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([withToken, withJson]);

	return baseOptions(yargs)
		.option("column", {
			describe: "Project column ID",
			demandOption: true,
			type: "number"
		})
		.option("pull-request", {
			describe: "Pull request ID",
			demandOption: true,
			type: "number"
		});
};

/**
 * Add a pull request to an organisation's project.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {number} argv.column
 * @param {number} argv.pullRequest
 * @param {string} argv.json
 */
const handler = async ({ token, column, pullRequest, json }) => {
	if (isNaN(column) || isNaN(pullRequest)) {
		throw new Error("Column and pull request ID must be a number");
	}

	const { createPullRequestCard } = github({
		personalAccessToken: token
	});

	const inputs = {
		column_id: column,
		content_id: pullRequest,
		content_type: "PullRequest"
	};

	const projectCard = await createPullRequestCard(inputs);

	printOutput({ json, resource: projectCard });
};

module.exports = {
	command: "project:add-pull-request",
	desc: "Add a pull request to a project",
	builder,
	handler
};
