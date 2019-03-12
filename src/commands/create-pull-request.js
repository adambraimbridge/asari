const fs = require("fs");
const github = require("../index");
const printOutput = require("../lib/print-output");

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	return yargs
		.option("owner", {
			alias: "o",
			describe: "Owner",
			demandOption: true,
			type: "string"
		})
		.option("repo", {
			alias: "r",
			describe: "Repository",
			demandOption: true,
			type: "string"
		})
		.option("title", {
			alias: "t",
			describe: "Pull request title",
			demandOption: true,
			type: "string"
		})
		.option("branch", {
			describe: "Branch",
			demandOption: true,
			type: "string"
		})
		.option("base", {
			describe: "Base branch",
			default: "master",
			type: "string"
		})
		.option("body", {
			describe: "Path to pull request body",
			type: "string"
		})
		.option("token", {
			describe: "GitHub personal access token",
			demandOption: true,
			type: "string"
		});
};

/**
 * Return the contents of a pull request body and create a pull request.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.owner
 * @param {string} argv.repo
 * @param {string} argv.title
 * @param {string} argv.branch
 * @param {string} [argv.base]
 * @param {string} [argv.body]
 * @param {string} argv.json
 * @throws {Error} - Throws an error if `body` is invalid
 */
const handler = async ({
	token,
	owner,
	repo,
	title,
	branch,
	base,
	body,
	json
}) => {
	const filePathProvided = typeof body !== "undefined";
	const incorrectFilePath = filePathProvided && !fs.existsSync(body);
	const correctFilePath = filePathProvided && fs.existsSync(body);

	if (!owner || !repo || !title || !branch) {
		throw new Error("Owner, repo, title and branch must be provided");
	}

	if (incorrectFilePath) {
		throw new Error(`File path ${body} not found`);
	}

	const { createPullRequest } = github({
		personalAccessToken: token
	});

	const pullRequestBody = correctFilePath
		? fs.readFileSync(body, "utf8")
		: undefined;
	const inputs = {
		owner,
		repo,
		title,
		head: branch,
		base,
		body: pullRequestBody
	};

	const pullRequest = await createPullRequest(inputs);

	printOutput({ json, resource: pullRequest });
};

module.exports = {
	command: "pull-request:create",
	desc: "Create a new pull request",
	builder,
	handler
};
