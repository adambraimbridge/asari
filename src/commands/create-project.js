/* eslint-disable no-console */

const github = require('../index');

/**
 * yargs builder function.
 *
 * @param {import('yargs').Yargs} yargs - Instance of yargs
 */
const builder = (yargs) => {
    return yargs
        .option('org', {
            alias: 'o',
            describe: 'Organization',
            demandOption: true,
            type: 'string',
        })
        .option('name', {
            alias: 'n',
            describe: 'Project name',
            demandOption: true,
            type: 'string',
        })
        .option('token', {
            describe: 'GitHub personal access token',
            demandOption: true,
            type: 'string',
        });
};

/**
 * Create an organisation project with columns.
 *
 * @param {object} argv - argv parsed and filtered by yargs
 * @param {string} argv.token
 * @param {string} argv.org
 * @param {string} argv.name
 */
const handler = async ({ token, org, name }) => {

    if (!org || !name) {
        throw new Error(
            'Organisation (--org) and project name (--name) must be provided'
        );
    }

    const createProjectError = (error) => {
        throw new Error(`Creating a project failed. Response: ${error}.`)
    };

    const { createProject, createProjectColumn } = github({
        personalAccessToken: token
    });

    const project = await createProject({
        org,
        name
    }).catch(createProjectError);

    const toDoColumn = await createProjectColumn({
        project_id: project.id,
        name: 'To do'
    }).catch(createProjectError);

    const inProgressColumn = await createProjectColumn({
        project_id: project.id,
        name: 'In progress'
    }).catch(createProjectError);

    const doneColumn = await createProjectColumn({
        project_id: project.id,
        name: 'Done'
    }).catch(createProjectError);

    // Create an object that resembles a JSON structure
    const details = {
        project: project.id,
        columns: {
            todo: toDoColumn.id,
            doing: inProgressColumn.id,
            done: doneColumn.id
        }
    };

    const json = JSON.stringify(details);

    // Print JSON string to console which allows user to copy/save column IDs
    // Column IDs are needed to add pull requests to an organisation's project
    console.log(json);
};

module.exports = {
    command: 'project:create',
    desc: 'Create a new project',
    builder,
    handler,
};

