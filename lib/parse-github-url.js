/**
 * Parse appropriate values from a GitHub URL.
 */
// const GITHUB_URL_REGEX = /^(?:\S*github\.com(?:\/|:))?([\w-]+)\/([\w-]+)/
const SUPPORTED_GITHUB_URL_PATTERNS = [
	// prettier-ignore
	'https://github.com/[owner]/[repository]/[endpoint]/[value]',
	'github.com/[owner]/[repository]/[endpoint]/[value]',
	'[subdomain].github.com/[owner]/[repository]/[endpoint]/[value]',
	'[owner]/[repository]/[endpoint]/[value]',
]

/**
 * @param {string} arg A URL expected to be in an acceptable GitHub format.
 *
 * Pattern: https://github.com/[owner]/[repository]/[endpoint]/[value]
 */
const parseGitHubURL = arg => {
	debugger //nocommit

	const GITHUB_URL_REGEX = /^(?:\S*github\.com(?:\/|:))?([\w-]+)\/([\w-]+)\/([\w-]+)\/([\w-\#]+)/
	const matches = GITHUB_URL_REGEX.exec(arg)
	if (matches === null) {
		throw new Error(`ERROR: Invalid URL. The URL must match one of the following:\n\n- ${SUPPORTED_GITHUB_URL_PATTERNS.join('\n- ')}`)
	}
	const [, owner, repo, endpoint, value] = matches

	let coercedValue
	switch (endpoint) {
		default:
		case 'pull':
			// Pull request ID: https://github.com/Financial-Times/github/pull/49
			coercedValue = value
			break
		case 'projects':
			// Project column ID: https://github.com/Financial-Times/github/projects/2#column-4655618
			coercedValue = value.split('-')[1]
			break
	}

	return {
		owner,
		repo,
		endpoint,
		value: coercedValue,
	}
}

module.exports = parseGitHubURL
