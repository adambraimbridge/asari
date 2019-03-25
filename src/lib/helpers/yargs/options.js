/* eslint-disable no-console */

const descriptions = {
	token:
		"GitHub personal access token (uses `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable by default). Generate one at https://github.com/settings/tokens/new?scopes=repo,write:org.",
	json: "Format command output as JSON string"
};

const withToken = yargs => {
	return yargs.option("token", {
		describe: descriptions.token,
		type: "string",
		// IMPORTANT: We use a function here so the token is not output on the command line
		default: () => process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
		coerce: value => {
			if (!value) {
				throw new Error(
					"Error: `--token` option is required as a valid GITHUB_PERSONAL_ACCESS_TOKEN environment variable does not exist"
				);
			}
			return value;
		}
	});
};

const withJson = yargs => {
	return yargs.option("json", {
		describe: descriptions.json,
		type: "boolean"
	});
};

module.exports = {
	descriptions,
	withToken,
	withJson
};
