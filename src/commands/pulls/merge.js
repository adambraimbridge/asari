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
		commonYargs.withBase,
		commonYargs.withOwner,
		commonYargs.withRepo,
		commonYargs.withNumber,
	])
	return baseOptions(yargs)
		.option("commit_title", {
			alias: "t",
			describe: "Pull request commit title",
			type: "string"
		})
		.option("commit_message", {
			alias: "m",
			describe: "Pull request commit message",
			type: "string"
		})
		.option("sha", {
			describe: "SHA that the pull request head must match to allow merge",
			type: "string"
		})
		.option("merge_method", {
			describe: "Merge method to use. Possible values are merge, squash or rebase. Default is merge.",
			type: "string"
		})
}

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.json
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.number
 * @param {string} [argv.commit_title]
 * @param {string} [argv.commit_message]
 * @param {string} [argv.sha]
 * @param {string} [argv.merge_method]
 * @throws {Error} - Throws an error if any required properties are invalid
 */
const handler = async ({ token, json, owner, repo, number, commit_title, commit_message, sha, merge_method }) => {

	// Ensure that all required properties have values
	const requiredProperties = {
		owner,
		repo,
		number,
	}
	if (Object.values(requiredProperties).some(property => !property)) {
		throw new Error(`Please provide all required properties: ${Object.keys(requiredProperties).join(", ")}`)
	}

	const inputs = Object.assign({}, requiredProperties, {
		commit_title,
		commit_message,
		sha,
		merge_method,
	})
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.pulls.merge(inputs)
		printOutput({ json, resource: result })
	}
	catch (error) {
		throw new Error(error)
	}
}

module.exports = {
	command: "pulls merge",
	desc: "Merge an existing pull request",
	builder,
	handler
}
