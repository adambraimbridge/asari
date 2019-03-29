const flow = require('lodash.flow');
const { URL } = require('url');

const github = require("../lib/github");
const { withToken } = require('../lib/helpers/yargs/options');

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([withToken]);

	return baseOptions(yargs)
		.positional('path', {
            describe: 'URL path to project',
            type: 'string'
		});
};

/**
 * Close a project.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.path
 */
const handler = async ({ token, path }) => {
	const url = new URL(path);
	const pathName = url.pathname;
	const [ , projectType, name ] = pathName.split('/');

	const { listProjects } = github({
		personalAccessToken: token
	});

	const openProjects = await listProjects({ org: name }).catch(error => {
		throw new Error(`Listing all open projects failed. Response: ${error}.`);
	});

	console.log(openProjects);
};

module.exports = {
	command: "projects:close <path>",
	desc: "Close a project",
	builder,
	handler
};
