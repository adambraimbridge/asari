/**
 * These descriptions are exported so that they can be used to group global options in usage output.
 */
const descriptions = {
	token: "GitHub personal access token (uses `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable by default). Generate one at https://github.com/settings/tokens.",
	json: "Format command output as JSON string",
}

const withToken = yargs => yargs.option("token", {

	// IMPORTANT: We use a function here so the token is not output on the command line.
	default: () => process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
	describe: descriptions.token,
	type: "string",
	coerce: value => {
		if (!value) {
			throw new Error(
				"Error: `--token` option is required as a valid GITHUB_PERSONAL_ACCESS_TOKEN environment variable does not exist"
			)
		}
		return value
	}
})

const withJson = yargs => yargs.option("json", {
	describe: descriptions.json,
	type: "boolean",
})

const withBase = yargs => yargs.option("base", {
	describe: "Base branch",
	type: "string",
	default: "master",
})

const withOwner = yargs => yargs.option("owner", {
	alias: "o",
	describe: "Owner",
	type: "string",
	demandOption: true,
})

const withRepo = yargs => yargs.option("repo", {
	alias: "r",
	describe: "Repository",
	type: "string",
	demandOption: true,
})

const withNumber = yargs => yargs.option("number", {
	alias: "n",
	describe: "Number",
	type: "integer",
	demandOption: true,
})

const withReviewers = yargs => yargs.option("reviewers", {
	describe: "Reviewers",
	type: "string",
})

const withTeamReviewers = yargs => yargs.option("team_reviewers", {
	describe: "Team reviewers",
	type: "string",
})

const withBody = yargs => yargs.option("body", {
	describe: "Path to pull request body",
	type: "string",
})

module.exports = {
	descriptions,
	withToken,
	withJson,
	withBase,
	withOwner,
	withRepo,
	withNumber,
	withReviewers,
	withTeamReviewers,
	withBody,
}
