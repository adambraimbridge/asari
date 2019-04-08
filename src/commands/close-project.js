const flow = require('lodash.flow');
const { URL } = require('url');

const github = require('../lib/github');
const { withToken, withJson } = require('../lib/helpers/yargs/options');
const printOutput = require('../lib/helpers/print-output');

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = yargs => {
	const baseOptions = flow([withToken, withJson]);

	return baseOptions(yargs)
		.positional('path', {
            describe: 'Project URL',
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
const handler = async ({ token, path, json }) => {
	const url = new URL(path);
	const pathName = url.pathname;
	// TODO: Use projectType to distinguish if a repo, user or org project needs to be closed
	const [ , projectType, name ] = pathName.split('/'); // eslint-disable-line no-unused-vars

	const { listProjects, closeProject } = github({
		personalAccessToken: token
	});

	const openProjects = await listProjects({ org: name }).catch(error => {
		throw new Error(`Listing all open projects failed. Response: ${error}.`);
	});

	let projectId;
	for (let i of openProjects) {
		if (i.html_url === path) {
			projectId = i.id;
		}
	}

	const closedProject = await closeProject({ project_id: projectId }).catch(error => {
		throw new Error(`Closing project failed. Response: ${error}.`);
	});

	printOutput({ json, resource: closedProject });
};

module.exports = {
	command: 'projects:close <path>',
	desc: 'Close a project',
	builder,
	handler
};
