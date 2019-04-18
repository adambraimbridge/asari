/**
 * Parse appropriate values from a GitHub URL.
 */
const SUPPORTED_GITHUB_URL_PATTERNS = [
	// prettier-ignore
	'https://github.com/[owner]/[repository]/[endpoint]/[value]',
	'https://github.com/[scope]/[owner]/[endpoint]/[value]',
	'github.com/[owner]/[repository]/[endpoint]/[value]',
	'[subdomain].github.com/[owner]/[repository]/[endpoint]/[value]',
	'[owner]/[repository]/[endpoint]/[value]',
]

/**
 * @param {string} arg A URL expected to be in an acceptable GitHub format.
 *
 * Pattern: https://github.com/[scope?]/[owner?]/[repository?]/[endpoint?]/[value?]
 */
const parseGitHubURL = arg => {
	const GITHUB_URL_REGEX = /^(?:\S*github\.com(?:\/|:))?([\w-\/\#]+)/i
	const matches = GITHUB_URL_REGEX.exec(arg)
	if (matches === null) {
		throw new Error(`ERROR: Invalid URL. The URL must match one of the following:\n\n- ${SUPPORTED_GITHUB_URL_PATTERNS.join('\n- ')}`)
	}
	// Convert a string to an ID (e.g from '123#column-456' to '456')
	const getID = slug => slug.split('-')[1] || slug
	const parsed = {
		scope: null,
		owner: null,
		repo: null,
		endpoint: null,
		id: null,
	}
	const parts = matches[1].split('/')
	if (parts[0] === 'orgs') {
		// Project: https://github.com/orgs/[owner]/projects/[id]
		// Project column: https://github.com/orgs/[owner]/projects/[id]#column-[columnId]
		const { 0: scope, 1: owner, 2: endpoint, 3: id } = parts
		Object.assign(parsed, { scope, owner, endpoint, id: getID(id) })
	} else if (['projects', 'pull'].includes(parts[2])) {
		// Pull request ID: https://github.com/[owner]/[repo]/pull/[id]
		const { 0: owner, 1: repo, 2: endpoint, 3: id } = parts
		Object.assign(parsed, { owner, repo, endpoint, id: getID(id) })
	} else {
		console.error({ arg })
		console.error({ parts })
		throw new Error('Error getting values from the URL. Sorry. ¯\\_(ツ)_/¯')
	}
	return parsed
}

module.exports = parseGitHubURL
