#!/usr/bin/env node

const decamelize = require("decamelize");
const yargs = require("yargs");

const github = require("./index");

/**
 * We probably don't want to require this dynamically as it creates a dependency
 * on the internal implementation of `@octokit/rest`. I can't see a way to access
 * these route definitions through any of Octokit's public methods, so we should
 * possibly just extract and commit the `routes.json` file to this package whenever
 * we update the `@octokit/rest` dependency.
 */
const octokitRoutes = require("@octokit/rest/plugins/rest-api-endpoints/routes.json");

const formatAsJsonString = (object) => {
	return JSON.stringify(object, null, 2);
};

const outputFormatters = {
	'projects:list-for-org': {
		standard: (output) => {
			return '\n' + output
				.map((project) => `- ${project.name} [${project.state}] - ${project.html_url}`)
				.join('\n\n') + '\n';
		},
		json: (output) => {
			const formatted = output.map((project) => {
				return { id: project.id, name: project.name, url: project.html_url, state: project.state };
			});
			return formatAsJsonString(formatted);
		}
	}
};

const defaultOutputFormatter = {
	standard: (output) => {
		return '\n' + output
			.map((entity) => `- ${entity.name} - ${entity.html_url}`)
			.join('\n\n') + '\n';
	},
	json: (output) => {
		const formatted = JSON.parse(JSON.stringify(output));
		return formatAsJsonString(formatted);
	}
};

const paramsToOptions = (params) => {

	// Convert route params into something yargs can digest
	const options = Object.keys(params).map(paramName => {
		const param = params[paramName];

		const opt = {};

		opt.type = param.type;
		if (opt.type === "integer") {
			opt.type = "number";
		}

		if (param.required === true) {
			opt.demandOption = true;
		}

		if (param.enum) {
			opt.choices = param.enum;
		}

		return [paramName, opt];
	});

	return options;
};

const scopes = ['projects', 'pulls'];

for (let scope of scopes) {
	const routes = octokitRoutes[scope];
	const routesNames = Object.keys(routes);
	for (let routeIdName of routesNames) {
		const commandName = `${scope}:${decamelize(routeIdName, "-")}`;

		yargs.command({
			command: commandName,
			description: "...",
			builder: yargs => {
				const options = paramsToOptions(routes[routeIdName].params);
				for (let option of options) {
					yargs.option.apply(null, option);
				}
				return yargs;
			},
			handler: async (argv) => {
				const { octokit } = github({
					personalAccessToken: argv.token
				});

				const octokitMethod = octokit[scope][routeIdName];

				/**
				 * Strip out what we don't need.
				 *
				 * We should probably just be picking only what we need based on the
				 * params in Octokit routes.
				 */
				delete argv.token;

				let result = (await octokitMethod(argv)).data;
				if (result.constructor !== Array) {
					result = [result];
				}

				let formatter = outputFormatters[commandName] && outputFormatters[commandName][argv.output];
				if (!formatter) {
					formatter = defaultOutputFormatter[argv.output];
				}

				console.log(formatter(result));
			}
		});
	}
}

const { GITHUB_PERSONAL_ACCESS_TOKEN } = process.env;

yargs
	.option("token", {
		alias: "t",
		type: 'string',
		// NOTE: Use a function here, so the token is not displayed in the command line
		default: () => GITHUB_PERSONAL_ACCESS_TOKEN,
		describe: "Your GitHub personal access token (uses `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable by default). Generate one from https://github.com/settings/tokens",
	})
	.option("output", {
		alias: "o",
		description: "Output format",
		choices: ['standard', 'json'],
		default: 'standard',
		type: 'string',
	})
	.demandCommand(1, "You must specify a command")
	.strict()
	.help()
	.wrap(yargs.terminalWidth() * 0.6)
	.argv;
