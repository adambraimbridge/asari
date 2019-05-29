/**
 * @see: https://octokit.github.io/rest.js/#octokit-routes-rateLimit
 */
const printOutput = require('../lib/print-output')
const authenticatedOctokit = require('../lib/octokit')

const handler = async ({ token, json }) => {
	try {
		const octokit = await authenticatedOctokit({ personalAccessToken: token })
		const result = await octokit.rateLimit.get()
		Object.keys(result.data.resources).forEach(row => {
			console.log(`${row} \n • Remaining = ${result.data.resources[row].remaining} / ${result.data.resources[row].limit} \n • Reset     = ${new Date(result.data.resources[row].reset * 1000)}\n`)
		})
		printOutput({ json, resource: result.data })
	} catch (error) {
		printOutput({ json, error })
	}
}

module.exports = {
	command: 'allowance',
	desc: 'Display current GitHub API rate-limiting allowance.',
	handler,
}
