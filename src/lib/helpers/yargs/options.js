/* eslint-disable no-console */

const withToken = yargs => {
	return yargs.option("token", {
		describe:
			"GitHub personal access token (uses `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable by default). Generate one at https://github.com/settings/tokens.",
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

module.exports = { withToken };
