/**
 * @see: https://octokit.github.io/rest.js/#api-Pulls-merge
 * const result = await octokit.pulls.merge({ owner, repo, number, *commit_title, *commit_message, *sha, *merge_method})
 * /repos/:owner/:repo/pulls/:number/merge
 */
const flow = require("lodash.flow")
const commonYargs = require("../../../lib/common-yargs")
const printOutput = require("../../../lib/print-output")
const authenticatedOctokit = require("../../../lib/octokit")

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([
		commonYargs.withToken,
		commonYargs.withJson,
		commonYargs.withPullRequest,
	]);

	return baseOptions(yargs)
		.option("method", {
			describe: "Merge method to use.",
			choices: ["merge", "squash", "rebase"],
			default: "merge"
		});
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async (argv) => {
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: argv.token });

		const result = await octokit.pulls.merge({
			owner: argv.pr.owner,
			repo: argv.pr.repo,
			pull_number: argv.pr.number,
			merge_method: argv.method,
		});

		printOutput({ json: argv.json, resource: result });
	} catch (error) {
		throw new Error(error);
	}
}

module.exports = {
	command: "merge <pr>",
	desc: "Merge an existing pull request",
	builder,
	handler
}
