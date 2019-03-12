const createForOrgResponse = require("./fixtures/createForOrg");
const createResponse = require("./fixtures/create");
const createCardResponse = require("./fixtures/createCard");
const createColumnResponse = require("./fixtures/createColumn");

function Octokit() {}

Octokit.prototype.authenticate = jest.fn();

Octokit.prototype.projects = {
	createForOrg: () => ({ data: createForOrgResponse }),
	createCard: () => ({ data: createCardResponse }),
	createColumn: () => ({ data: createColumnResponse })
};

Octokit.prototype.pulls = {
	create: () => ({ data: createResponse })
};

module.exports = Octokit;
